define([
    'uiRegistry',
    'jquery',
    'Magento_Customer/js/model/address-list',
    'Magento_Customer/js/model/customer/address',
    'Magento_Checkout/js/model/shipping-service',
    'PayPal_Fastlane/js/model/fastlane',
    'PayPal_Fastlane/js/helpers/get-region-id'
], function (uiRegistry, $, addressList, Address, shippingService, fastlaneModel, getRegionId) {
    'use strict';

    var mixin = {
        shippingServiceSubscription: null,

        /**
         * Add mixin to the checkEmailAvailability so we can trigger Fastlane.
         */
        checkEmailAvailability: async function () {
            this._super();

            // Fastlane requires a localStorage key set to determine which environment to use.
            window.localStorage.setItem('axoEnv', window.checkoutConfig.payment.braintree.environment);

            await fastlaneModel.setup();

            // Check the entered email against Fastlane to see if we have an account.
            const { customerContextId } = await fastlaneModel.lookupCustomerByEmail(this.email());

            // If we have do have an account then trigger the authentication.
            if (customerContextId) {
                $(document.body).trigger('processStart');

                const { profileData } = await fastlaneModel.triggerAuthenticationFlow(customerContextId);

                // With a street address we can begin processing the User to auto-populate the data in the checkout.
                if (profileData?.shippingAddress?.streetAddress) {
                    this.processUserData(profileData);
                } else {
                    $(document.body).trigger('processStop');
                }
            }
        },

        /**
         * Handles all of the data from Fastlane and populating that into Adobe Commerce checkout models.
         *
         * @param {Object} profileData - The complete profile data as gathered from Fastlane.
         * @param {Object} [profileData.card] - Optional card data object.
         * @param {Object} [profileData.name] - Optional name data object.
         * @param {Object} [profileData.shippingAddress] - Optional shipping address object.
         */
        processUserData: async function (profileData) {
            // Clean up any existing subscriptions so we don't add more than one at a time.
            if (this.shippingServiceSubscription) {
                this.shippingServiceSubscription.dispose();
            }

            const mappedAddress = this.mapAddress(profileData.shippingAddress);

            // Subscribe to get the updated shipping rates.
            this.shippingServiceSubscription = shippingService.getShippingRates().subscribe(function (rates) {
                this.shippingServiceSubscription.dispose();

                // If there is an array of methods then select the first one and set it to the correct models.
                if (rates && rates[0]) {
                    const shippingAddress = uiRegistry.get('checkout.steps.shipping-step.shippingAddress');

                    shippingAddress.selectShippingMethod(rates[0]);
                    shippingAddress.setShippingInformation();

                    $(document.body).trigger('processStop');
                }
            }.bind(this));

            // Push the mapped address into the correct models which will trigger getting the updated shipping methods.
            addressList.push(mappedAddress);
            this.addAddressToCheckoutProvider(mappedAddress);
        },

        /**
         * Fastlane provides an address object that isn't in the correct Adobe Commerce format so map it to the
         * correct format.
         *
         * @param {Object} address - An address object as gathered from Fastlane.
         * @returns {Object} - A correctly mapped address using 'Magento_Customer/js/model/customer/address' model.
         */
        mapAddress: function (address) {
            const mappedAddress = Address({
                region: {
                    region_id: getRegionId(address.countryCodeAlpha2, address.region),
                    region_code: address.region
                },
                company: address.company,
                country_id: address.countryCodeAlpha2,
                street: [
                    address.streetAddress
                ],
                firstname: address.firstName,
                lastname: address.lastName,
                city: address.locality,
                telephone: address.phoneNumber,
                postcode: address.postalCode
            });

            if (address.extendedAddress) {
                mappedAddress.street.push(address.extendedAddress);
            }

            return mappedAddress;
        },

        /**
         * Push the new address into the checkout provider.
         *
         * @param {Object} address - A complete address object in the correct Adobe Commerce format.
         */
        addAddressToCheckoutProvider(address) {
            const checkoutProvider = uiRegistry.get('checkoutProvider'),
                existingAddress = checkoutProvider.get('shippingAddress'),
                tempStreet = address.street;

            address.street = {
                0: tempStreet[0],
                1: tempStreet[1] || ''
            };
            address.country_id = address.countryId;
            address.region_code = address.regionCode;
            address.region_id = address.regionId;

            checkoutProvider.set(
                'shippingAddress',
                $.extend({}, existingAddress, address)
            );
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});
