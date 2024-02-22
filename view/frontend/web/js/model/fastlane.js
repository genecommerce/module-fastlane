define([
    'jquery',
    'knockout',
    'uiRegistry',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/action/select-payment-method',
    'Magento_Checkout/js/action/set-shipping-information',
    'Magento_Checkout/js/checkout-data',
    'Magento_Checkout/js/model/shipping-service',
    'Magento_Checkout/js/model/step-navigator',
    'Magento_Customer/js/model/address-list',
    'braintree',
    'braintreeDataCollector',
    'braintreeFastlane',
    'PayPal_Fastlane/js/helpers/map-address'
], function ($, ko, uiRegistry, quote, selectPaymentMethodAction, setShippingInformationAction, checkoutData,
    shippingService, stepNavigator, addressList, client, dataCollector, brainteeFastlane, mapAddress) {
    'use strict';

    return {
        clientInstance: null,
        fastlaneInstance: null,
        fastlaneCardComponent: null,
        deviceData: null,
        runningSetup: null,
        profileData: ko.observable(null),

        /**
         * Return the client token from configuration.
         *
         * @returns {string}
         */
        getClientToken: function () {
            return window.checkoutConfig.payment.braintree.clientToken;
        },

        /**
         * Creates the client and data collector instances.
         *
         * The client instance is assigned to this.clientInstance.
         *
         * @returns {Promise}
         */
        createClientInstance: async function () {
            this.clientInstance = await client.create({
                authorization: this.getClientToken()
            });

            return this.createDataCollectorInstance(this.clientInstance);
        },

        /**
         * Creates the data collector instance.
         *
         * The data collector instance is assigned to this.deviceData.
         *
         * @param {Object} clientInstance - A Braintree client instance made using client.create().
         * @returns {void}
         */
        createDataCollectorInstance: async function (clientInstance) {
            const options = {
                    client: clientInstance
                },
                dataCollectorInstance = await dataCollector.create(options);

            this.deviceData = dataCollectorInstance.deviceData;
        },

        /**
         * Creates the Fastlane instance.
         *
         * The Fastlane instance is assigned to this.fastlaneInstance.
         *
         * @returns {void}
         */
        createFastlaneInstance: async function () {
            this.fastlaneInstance = await brainteeFastlane.create({
                authorization: this.getClientToken(),
                client: this.clientInstance,
                deviceData: this.deviceData
            });
        },

        /**
         * Setups all of the required instances needed for Fastlane.
         *
         * @returns {Promise} A promise that completes once the client, data collector and Fastlane instances
         * have been created.
         */
        setup: async function () {
            // If the Fastlane instance has already been creates then immediately return a completed promise.
            if (this.fastlaneInstance) {
                return Promise.resolve();
            }

            // There are multiple different components that can call the setup function at the same time so this
            // is in place to prevent creating multiple instances.
            if (this.runningSetup) {
                return this.runningSetup;
            }

            this.runningSetup = new Promise(async (resolve) => {
                // Fastlane requires a localStorage key set to determine which environment to use.
                window.localStorage.setItem('axoEnv', window.checkoutConfig.payment?.braintree?.environment);

                if (!this.clientInstance) {
                    await this.createClientInstance();
                }

                if (!this.fastlaneInstance) {
                    await this.createFastlaneInstance();
                }

                const email = checkoutData.getInputFieldEmailValue();

                // If we have an email address already then try the lookup.
                if (email) {
                    await this.lookupCustomerByEmail(email);
                }

                resolve();
            });

            return this.runningSetup;
        },

        /**
         * Run the lookup for an email address within Fastlane.
         *
         * This will reset data within this.profileData and this.customerContextId and then trigger
         * another authentication if a new account is found.
         *
         * @param {string} email
         * @returns {void}
         */
        lookupCustomerByEmail: async function (email) {
            $(document.body).trigger('processStart');

            // When we perform another lookup destroy all existing data.
            this.profileData(null);
            this.customerContextId = null;

            // Lookup the new User.
            const { customerContextId } = await this.fastlaneInstance.identity.lookupCustomerByEmail(email);

            $(document.body).trigger('processStop');

            this.customerContextId = customerContextId;

            // If we have do have an account then trigger the authentication.
            if (this.customerContextId) {
                return this.triggerAuthenticationFlow();
            }
        },

        /**
         * Trigger the authentication flow within Fastlane.
         *
         * Once the User has finished the action the information will be available within this.profileData.
         *
         * @returns {void}
         */
        triggerAuthenticationFlow: async function () {
            $(document.body).trigger('processStart');
            const { profileData }
                = await this.fastlaneInstance.identity.triggerAuthenticationFlow(this.customerContextId);

            $(document.body).trigger('processStop');

            // With the account data push it into the required models.
            if (profileData) {
                this.profileData(profileData);
                // With a street address we can begin processing the User to auto-populate the data in the checkout.
                if (profileData?.shippingAddress?.streetAddress) {
                    this.processUserData(profileData);
                }
            }
        },

        /**
         * Renders the Fastlane card component inside the given css selector.
         *
         * @param {string} selector The css selector where to render the card component.
         * @returns {void}
         */
        renderConnectCardComponent: async function (selector) {
            if (this.fastlaneInstance) {
                const fields = {
                    phoneNumber: {
                        prefill: this.profileData()?.shippingAddress?.phoneNumber
                            || quote.billingAddress().telephone || ''
                    }
                };

                // Add the card holder name field if enabled in config.
                if (window.checkoutConfig.fastlane.show_cardholder_name) {
                    fields.cardholderName = {};
                }

                this.fastlaneCardComponent = await this.fastlaneInstance
                    .ConnectCardComponent({ fields }).render(selector);
            }
        },

        /**
         * Shows the address Fastlane address selector.
         *
         * When the User selects a new address this will automatically call `processUserData` with the updated
         * information.
         *
         * @returns {void}
         */
        displayChangeShipping: async function () {
            if (this.fastlaneInstance.profile) {
                $(document.body).trigger('processStart');

                const {
                    selectionChanged,
                    selectedAddress
                } = await this.fastlaneInstance.profile.showShippingAddressSelector();

                $(document.body).trigger('processStop');

                if (selectionChanged) {
                    $(document.body).trigger('processStart');
                    this.processUserData({ shippingAddress: selectedAddress });
                }
            }
        },

        /**
         * Displays the change card component from Fastlane.
         *
         * When a User updates their card information this will automatically pass this into the appropriate
         * quote models to update their billing address and card.
         *
         * @returns {void}
         */
        displayChangeCard: async function () {
            if (this.fastlaneCardComponent) {
                const { selectionChanged, selectedCard } = await this.fastlaneInstance.profile.showCardSelector();

                if (selectionChanged) {
                    this.selectedCard = selectedCard;

                    const mappedAddress = mapAddress(this.selectedCard.paymentSource.card.billingAddress),
                        currentBilling = quote.billingAddress();

                    quote.billingAddress($.extend({}, currentBilling, mappedAddress));
                }
            }
        },

        /**
         * Renders the Fastlane watermark into the given selector.
         * @param {string} selector The css selector where to render the watermark component.
         * @returns {void}
         */
        renderConnectWatermarkComponent: function (selector) {
            if (this.fastlaneInstance) {
                this.fastlaneInstance.ConnectWatermarkComponent({
                    includeAdditionalInfo: true
                }).render(selector);
            }
        },

        /**
         * Handles all of the data from Fastlane and populating that into Adobe Commerce checkout models.
         *
         * @param {Object} profileData - The complete profile data as gathered from Fastlane.
         * @param {Object} [profileData.card] - Optional card data object.
         * @param {Object} [profileData.name] - Optional name data object.
         * @param {Object} [profileData.shippingAddress] - Optional shipping address object.
         * @returns {void}
         */
        processUserData: async function (profileData) {
            // Clean up any existing subscriptions so we don't add more than one at a time.
            if (this.shippingServiceSubscription) {
                this.shippingServiceSubscription.dispose();
            }

            const mappedAddress = mapAddress(profileData.shippingAddress),
                shippingAddress = uiRegistry.get('checkout.steps.shipping-step.shippingAddress');

            // Subscribe to get the updated shipping rates.
            this.shippingServiceSubscription = shippingService.getShippingRates().subscribe(function (rates) {
                this.shippingServiceSubscription.dispose();

                if (!rates || !rates.length) {
                    this.redirectToShipping();
                    return;
                }

                // If the shipping address is valid and we have found some shipping rates then set the data to quote.
                if (!shippingAddress.source.get('params.invalid') && rates && rates[0]) {
                    shippingAddress.selectShippingMethod(rates[0]);
                    setShippingInformationAction();

                    // If we are on the first step of the checkout then we can skip to the next step.
                    if (stepNavigator.getActiveItemIndex() === 0) {
                        stepNavigator.next();

                        // Automatically select Braintree as the payment method.
                        selectPaymentMethodAction({ method: 'braintree' });
                    }

                    $(document.body).trigger('processStop');
                }
            }.bind(this));

            // Push the mapped address into the correct models which will trigger getting the updated shipping methods.
            addressList.push(mappedAddress);
            this.addAddressToCheckoutProvider(mappedAddress);

            shippingAddress.source.set('params.invalid', false);
            shippingAddress.triggerShippingDataValidateEvent();

            if (shippingAddress.source.get('params.invalid')) {
                this.redirectToShipping();
            }
        },

        /**
         * Redirects the User back to the shipping step.
         * @returns {void}
         */
        redirectToShipping: function () {
            stepNavigator.setHash('shipping');
            $(document.body).trigger('processStop');
        },

        /**
         * Push the new address into the checkout provider.
         *
         * @param {Object} address - A complete address object in the correct Adobe Commerce format.
         * @returns {void}
         */
        addAddressToCheckoutProvider: function (address) {
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
            quote.shippingAddress(address);
            quote.billingAddress(address);
        },

        /**
         * Tokenize the payment using Fastlane.
         *
         * @returns {Promise}
         */
        tokenizePayment: function () {
            if (this.fastlaneCardComponent) {
                const billingAddress = quote.billingAddress();

                return this.fastlaneCardComponent.tokenize({ billingAddress });
            }
        }
    };
});
