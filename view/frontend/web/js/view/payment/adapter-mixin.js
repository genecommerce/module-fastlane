define([
    'jquery',
    'mage/utils/wrapper',
    'Magento_Customer/js/model/customer',
    'PayPal_Fastlane/js/model/fastlane'
], function ($, wrapper, customer, fastlaneModel) {
    'use strict';

    return function (adapter) {
        adapter.setupHostedFields = wrapper.wrapSuper(adapter.setupHostedFields, async function () {
            // Early return if the customer is logged in.
            // TODO: Add if statement whether Fastlane is enabled.
            if (customer.isLoggedIn()) {
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

