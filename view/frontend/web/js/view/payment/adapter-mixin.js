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

        return adapter;
    };
});

