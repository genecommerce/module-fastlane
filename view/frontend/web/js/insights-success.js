define([
    'PayPal_Fastlane/js/helpers/add-insights-event',
    'payPalInsights'
], function (addInsightsEvent) {
    'use strict';

    return function (config) {
        if (config.order.maskedId) {
            // TODO: Can we actually get client ID?
            const clientId = 'TEST_ID';

            addInsightsEvent('config', clientId, { merchant_id: config.merchantId });
            addInsightsEvent('event', 'js_load', { timestamp: Date.now() });
            addInsightsEvent('set', {
                'session_id': config.order.maskedId,
                'user': {
                    'is_store_member': false
                }
            });

            addInsightsEvent('event', 'end_checkout', {
                amount: {
                    currency_code: config.order.currencyCode,
                    value: config.order.value
                },
                payment_method_selected: config.order.method
            });
        }
    };
});
