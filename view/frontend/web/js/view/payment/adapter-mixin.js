define([
    'jquery',
    'mage/utils/wrapper',
    'PayPal_Fastlane/js/model/fastlane',
], function ($, wrapper, fastlaneModel) {
    'use strict';

    return function (adapter) {
        adapter.setupHostedFields = wrapper.wrapSuper(adapter.setupHostedFields, async function () {
            // TODO: Add if statement whether Fastlane is enabled.
            // this._super();

            await fastlaneModel.setup();
            const fastlaneCardComponent = await fastlaneModel.renderConnectCardComponent('#paypal-fastlane-payment');

            $(document.body).trigger('processStop');
        });

        return adapter;
    };
});

