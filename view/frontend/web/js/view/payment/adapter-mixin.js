define([
    'jquery',
    'mage/utils/wrapper',
    'PayPal_Fastlane/js/helpers/is-fastlane-available',
    'PayPal_Fastlane/js/model/fastlane'
], function ($, wrapper, isFastlaneAvailable, fastlaneModel) {
    'use strict';

    return function (adapter) {
        adapter.setupHostedFields = wrapper.wrapSuper(adapter.setupHostedFields, async function () {
            // If Fastlane is not available then run the standard hosted fields order.
            if (!isFastlaneAvailable()) {
                this._super();
                return;
            }

            await fastlaneModel.setup();
            await fastlaneModel.renderFastlanePaymentComponent('#paypal-fastlane-payment');

            $(document.body).trigger('processStop');
        });

        return adapter;
    };
});
