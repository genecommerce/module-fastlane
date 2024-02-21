define([
    'jquery',
    'PayPal_Fastlane/js/helpers/is-fastlane-available',
    'PayPal_Fastlane/js/model/fastlane'
], function ($, isFastlaneAvailable, fastlaneModel) {
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
                    await fastlaneModel.renderConnectCardComponent('#paypal-fastlane-payment');

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

            const response = await fastlaneModel.tokenizePayment();

            // Map the bin response from Fastlane to what is expected by Braintree core.
            response.details.bin = response.binData;

            this.clientConfig.onPaymentMethodReceived(response);
            return false;
        }

    };

    return function (target) {
        return target.extend(mixin);
    };
});
