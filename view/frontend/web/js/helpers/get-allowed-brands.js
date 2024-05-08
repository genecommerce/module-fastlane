define(function () {
    'use strict';

    return function () {
        const braintreeCards = window.checkoutConfig.payment?.braintree?.availableCardTypes || [],
            cardMap = {
                VI: 'VISA',
                MC: 'MASTER_CARD',
                DI: 'DISCOVER',
                AE: 'AMEX',
                JCB: 'JCB',
                MI: 'MAESTRO'
            };

        return braintreeCards.map((card) => cardMap[card] || null).filter(Boolean);
    };
});
