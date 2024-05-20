define([
    'knockout',
    'uiRegistry',
    'mage/translate',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/action/select-payment-method',
    'Magento_Checkout/js/action/set-shipping-information',
    'Magento_Checkout/js/model/shipping-service',
    'Magento_Checkout/js/model/step-navigator',
    'Magento_Customer/js/model/address-list',
    'Magento_Ui/js/model/messageList',
    'braintree',
    'braintreeDataCollector',
    'braintreeHostedFields',
    'braintreeFastlane',
    'PayPal_Fastlane/js/helpers/change-loading-state',
    'PayPal_Fastlane/js/helpers/get-allowed-brands',
    'PayPal_Fastlane/js/helpers/get-allowed-locations',
    'PayPal_Fastlane/js/helpers/get-styles',
    'PayPal_Fastlane/js/helpers/map-address-to-fastlane',
    'PayPal_Fastlane/js/helpers/map-address-to-magento'
], function (ko, uiRegistry, $t, quote, selectPaymentMethodAction, setShippingInformationAction, shippingService,
    stepNavigator, addressList, messageList, client, dataCollector, hostedFields, braintreeFastlane,
    changeLoadingState, getAllowedBrands, getAllowedLocations, getStyles, mapAddressToFastlane, mapAddressToMagento) {
    'use strict';

    return {
        clientInstance: null,
        fastlaneInstance: null,
        fastlanePaymentComponent: null,
        fastlaneWatermarkComponent: null,
        deviceData: null,
        runningSetup: null,
        customerContextId: null,
        profileData: ko.observable(null),

        /**
         * Return the client token from configuration.
         *
         * @returns {string}
         */
        getClientToken: function () {
            return window.checkoutConfig.payment?.braintree?.clientToken;
        },

        /**
         * Creates the client and data collector instances.
         *
         * The client instance is assigned to this.clientInstance.
         *
         * @returns {Promise}
         */
        createClientInstance: async function () {
            const clientToken = this.getClientToken();

            // If we haven't got a client Token available then set the instance to false and return.
            if (!clientToken) {
                this.clientInstance = false;
                return this.clientInstance;
            }

            this.clientInstance = await client.create({
                authorization: clientToken
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
            window.braintree = window.braintree || {};
            window.braintree.hostedFields = hostedFields;
            window.braintree.fastlane = braintreeFastlane;

            // Return early if we haven't got a client instance.
            if (!this.clientInstance) {
                return this.clientInstance;
            }

            return await window.braintree.fastlane.create({
                authorization: this.getClientToken(),
                cardOptions: {
                    allowedBrands: getAllowedBrands()
                },
                client: this.clientInstance,
                deviceData: this.deviceData,
                shippingAddressOptions: {
                    allowedLocations: getAllowedLocations()
                },
                styles: getStyles()
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
            if (this.fastlaneInstance !== null) {
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

                if (this.clientInstance === null) {
                    await this.createClientInstance();
                }

                if (this.fastlaneInstance === null) {
                    this.fastlaneInstance = await this.createFastlaneInstance();
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
            // Early return if we haven't run setup and got a valid Fastlane instance.
            if (!this.fastlaneInstance) {
                return;
            }

            changeLoadingState(true);

            // When we perform another lookup destroy all existing data.
            this.profileData(null);
            this.customerContextId = null;

            // Lookup the new User.
            const { customerContextId } = await this.fastlaneInstance?.identity?.lookupCustomerByEmail(email) || {};

            changeLoadingState(false);

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
            // Early return if we haven't run setup and got a valid Fastlane instance.
            if (!this.fastlaneInstance) {
                return;
            }

            changeLoadingState(true);
            const { profileData }
                = await this.fastlaneInstance.identity.triggerAuthenticationFlow(this.customerContextId);

            changeLoadingState(false);

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
        renderFastlanePaymentComponent: async function (selector) {
            // Early return if we haven't run setup and got a valid Fastlane instance.
            if (!this.fastlaneInstance) {
                return;
            }

            // If there is no customer context ID they must have reloaded on the payment page so trigger the
            // authentication here again.
            if (this.customerContextId === null) {
                await this.lookupCustomerByEmail(quote.guestEmail);
            }

            const shippingAddress = mapAddressToFastlane(quote.shippingAddress()),
                fields = {
                    phoneNumber: {
                        prefill: this.profileData()?.shippingAddress?.phoneNumber
                        || quote.shippingAddress().telephone || ''
                    },
                    cardholderName: {
                        enabled: window.checkoutConfig.fastlane.show_cardholder_name,
                        prefill: shippingAddress.firstName && shippingAddress.lastName
                            ? `${shippingAddress.firstName} ${shippingAddress.lastName}` : ''
                    }
                },
                styles = getStyles();

            this.fastlanePaymentComponent = await this.fastlaneInstance
                .FastlanePaymentComponent({ fields, shippingAddress, styles });
            this.fastlanePaymentComponent.render(selector);
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
            // Early return if we haven't run setup and got a valid Fastlane instance.
            if (!this.fastlaneInstance?.profile) {
                return;
            }

            changeLoadingState(true);

            const {
                selectionChanged,
                selectedAddress
            } = await this.fastlaneInstance.profile.showShippingAddressSelector();

            changeLoadingState(false);

            if (selectionChanged) {
                changeLoadingState(true);
                this.processUserData({ shippingAddress: selectedAddress });
            }
        },

        /**
         * Renders the Fastlane watermark into the given selector.
         * @param {string} selector The css selector where to render the watermark component.
         * @returns {void}
         */
        renderFastlaneWatermarkComponent: async function (selector) {
            // Early return if we haven't run setup and got a valid Fastlane instance.
            if (!this.fastlaneInstance) {
                return;
            }

            // Make sure the element still exists.
            if (!document.querySelector(selector)) {
                return;
            }

            this.fastlaneWatermarkComponent = await this.fastlaneInstance.FastlaneWatermarkComponent({
                includeAdditionalInfo: true
            });
            this.fastlaneWatermarkComponent.render(selector);
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

            try {
                // If the quote is virtual then open Braintree and stop.
                if (quote.isVirtual()) {
                    selectPaymentMethodAction({ method: 'braintree' });
                    return;
                }

                const mappedAddress = mapAddressToMagento(profileData.shippingAddress),
                    shippingAddress = uiRegistry.get('checkout.steps.shipping-step.shippingAddress');

                // Subscribe to get the updated shipping rates.
                this.shippingServiceSubscription = shippingService.getShippingRates().subscribe(function (rates) {
                    this.shippingServiceSubscription.dispose();

                    if (!rates || !rates.length) {
                        this.redirectToShipping();
                        return;
                    }

                    // If the shipping address is valid and we have some shipping rates then set the data to quote.
                    if (!shippingAddress.source.get('params.invalid') && rates && rates[0]) {
                        shippingAddress.selectShippingMethod(rates[0]);
                        setShippingInformationAction();

                        // If we are on the first step of the checkout then we can skip to the next step.
                        if (stepNavigator.getActiveItemIndex() === 0) {
                            stepNavigator.next();

                            // Automatically select Braintree as the payment method.
                            selectPaymentMethodAction({ method: 'braintree' });
                        }

                        changeLoadingState(false);
                    }
                }.bind(this));

                // Push mapped address into the correct models which will trigger getting the updated shipping methods.
                addressList.push(mappedAddress);
                this.addAddressToCheckoutProvider(mappedAddress);

                shippingAddress.source.set('params.invalid', false);
                shippingAddress.triggerShippingDataValidateEvent();

                if (shippingAddress.source.get('params.invalid')) {
                    this.redirectToShipping();
                }
            } catch {
                messageList.addErrorMessage({
                    message: $t('The selected shipping address is not available to be used. Please enter a new one.')
                });
                changeLoadingState(false);
            }
        },

        /**
         * Redirects the User back to the shipping step.
         * @returns {void}
         */
        redirectToShipping: function () {
            stepNavigator.setHash('shipping');
            changeLoadingState(false);
        },

        /**
         * Push the new address into the checkout provider.
         *
         * @param {Object} address - A complete address object in the correct Adobe Commerce format.
         * @returns {void}
         */
        addAddressToCheckoutProvider: function (address) {
            const checkoutProvider = uiRegistry.get('checkoutProvider');

            checkoutProvider.set(
                'shippingAddress',
                address
            );
            quote.shippingAddress({...address, street: Object.values(address.street)});
        },

        /**
         * Get the payment token.
         *
         * @returns {Promise}
         */
        getPaymentToken: function () {
            if (!this.fastlanePaymentComponent) {
                const error = new Error();

                error.name = 'paypal_fastlane:undefined_component';
                throw error;
            }

            return this.fastlanePaymentComponent.getPaymentToken();
        }
    };
});
