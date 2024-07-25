define(function () {
    'use strict';

    return function () {
        const braintreeCards = window.checkoutConfig.payment?.braintree?.availableCardTypes || [],
            cardMap = {
                AE: 'AMEX',
                DI: 'DISCOVER',
                DN: 'DINERS',
                JCB: 'JCB',
                MC: 'MASTER_CARD',
                MI: 'MAESTRO',
                UPD: 'UNION',
                VI: 'VISA'
            };

        return braintreeCards.map((card) => cardMap[card] || null).filter(Boolean);
    };
});
