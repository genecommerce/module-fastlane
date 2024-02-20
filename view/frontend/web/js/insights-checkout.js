define([
    'Magento_Checkout/js/model/quote',
    'PayPal_Fastlane/js/helpers/add-insights-event',
    'PayPal_Fastlane/js/helpers/get-masked-id',
    'payPalInsights'
], function (quote, addInsightsEvent, getMaskedId) {
    'use strict';

    return function (config) {
        const maskedId = getMaskedId();

        if (maskedId) {
            const totals = quote.totals();

            addInsightsEvent('config', config.clientId, { merchant_id: config.merchantId });
            addInsightsEvent('event', 'js_load', { timestamp: Date.now() });
            addInsightsEvent('set', {
                'session_id': maskedId,
                'user': {
                    'is_store_member': false
                }
            });

            addInsightsEvent('event', 'begin_checkout', {
                amount: {
                    currency_code: totals.quote_currency_code,
                    value: totals.grand_total
                }
            });

            // Attach subscription for changing payment method.
            quote.paymentMethod.subscribe(function (paymentMethod) {
                addInsightsEvent('event', 'select_payment_method', {
                    payment_method_selected: paymentMethod.method
                });
            });
        }
    };
});
