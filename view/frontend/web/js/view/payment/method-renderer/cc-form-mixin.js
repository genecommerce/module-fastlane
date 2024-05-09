define([
    'jquery',
    'uiRegistry',
    'mage/translate',
    'Magento_Checkout/js/model/quote',
    'Magento_Ui/js/model/messageList',
    'PayPal_Fastlane/js/helpers/is-fastlane-available',
    'PayPal_Fastlane/js/helpers/map-address-to-magento',
    'PayPal_Fastlane/js/model/fastlane'
], function ($, uiRegistry, $t, quote, messageList, isFastlaneAvailable, mapAddressToMagento, fastlaneModel) {
    'use strict';

    var mixin = {
        defaults: {
            clientConfig: {
                onReady: async function (context) {
                    // If Fastlane is not available then run the standard hosted fields order.
                    if (!isFastlaneAvailable()) {
                        context.setupHostedFields();
                        return;
                    }

                    await fastlaneModel.setup();
                    await fastlaneModel.renderFastlanePaymentComponent('#paypal-fastlane-payment');

                    $(document.body).trigger('processStop');
                }
            }
        },

        /**
         * Override the place order function to call Fastlane's tokenization if it's enabled.
         */
        placeOrder: async function (key) {
            // If Fastlane is not available then run the standard hosted fields order.
            if (!isFastlaneAvailable()) {
                return this._super(key);
            }

            if (key) {
                return this._super();
            }

            if (this.isProcessing) {
                return false;
            }
            this.isProcessing = true;

            try {
                const { id, paymentSource: { card: { billingAddress, name } } } = await fastlaneModel.getPaymentToken(),
                    data = {
                        nonce: id,
                        details: {
                            bin: {}
                        }
                    },
                    [firstname, ...lastname] = name.split(' '),
                    mappedAddress = mapAddressToMagento(billingAddress),
                    checkoutProvider = uiRegistry.get('checkoutProvider'),
                    braintreeBillingAddress = checkoutProvider.get('billingAddressbraintree');

                // Fastlane doesn't provide a phone number in the billing address so get it from shipping.
                mappedAddress.telephone = quote.shippingAddress().telephone;

                // Add the firstname and lastname as these aren't within the billing address from Fastlane either.
                mappedAddress.firstname = firstname;
                mappedAddress.lastname = lastname.join(' ');

                quote.billingAddress(mappedAddress);

                // Override all values of the Braintree billing address with the Fastlane values.
                Object.keys(braintreeBillingAddress).forEach((addressKey) => {
                    braintreeBillingAddress[addressKey] = mappedAddress[addressKey];
                });

                checkoutProvider.set(
                    'billingAddressbraintree',
                    braintreeBillingAddress
                );

                if (this.isBillingAddressValid()) {
                    this.clientConfig.onPaymentMethodReceived(data);
                } else {
                    this.isProcessing = false;
                    messageList.addErrorMessage({
                        message: $t('Your billing address is not valid.')
                    });
                }
            } catch (error) {
                this.isProcessing = false;
                messageList.addErrorMessage({
                    message: $t('The selected billing address is not available to be used. Please enter a new one.')
                });
            }

            return false;
        },

        /**
         * Validates the billing address in the checkout provider.
         *
         * @returns {Boolean}
         */
        isBillingAddressValid() {
            // Load the Braintree payment form.
            const billingAddress = uiRegistry.get('checkoutProvider');

            // Reset the validation.
            billingAddress.set('params.invalid', false);

            // Call validation and also the custom attributes validation if they exist.
            billingAddress.trigger(billingAddress.dataScopePrefix + '.data.validate');

            if (billingAddress.get(billingAddress.dataScopePrefix + '.custom_attributes')) {
                billingAddress.trigger(billingAddress.dataScopePrefix + '.custom_attributes.data.validate');
            }

            return !billingAddress.get('params.invalid');
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});
