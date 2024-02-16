define([
    'jquery',
    'mage/utils/wrapper',
    'PayPal_Fastlane/js/helpers/is-fastlane-available',
    'PayPal_Fastlane/js/model/fastlane'
], function ($, wrapper, isFastlaneAvailable, fastlaneModel) {
    'use strict';

    return function (adapter) {
        adapter.setupHostedFields = wrapper.wrapSuper(adapter.setupHostedFields, async function () {
            // Early return if Fastlane is not available.
            if (!isFastlaneAvailable()) {
                this._super();
                return;
            }

            await fastlaneModel.setup();
            await fastlaneModel.renderConnectCardComponent('#paypal-fastlane-payment');

            $(document.body).trigger('processStop');
        });

        adapter.tokenizeHostedFields = wrapper.wrapSuper(adapter.tokenizeHostedFields, async function () {
            // Early return if Fastlane is not available.
            if (!isFastlaneAvailable()) {
                this._super();
                return;
            }

            const response = await fastlaneModel.tokenizePayment();

            // Map the bin response from Fastlane to what is expected by Braintree core.
            response.details.bin = response.binData;

            this.config.onPaymentMethodReceived(response);
        });

        return adapter;
    };
});

