define(function () {
    'use strict';

    return function (paymentMethod) {
        switch (paymentMethod) {
        case 'braintree':
            return 'card';
        case 'braintree_applepay':
            return 'apple_pay';
        case 'braintree_googlepay':
            return 'google_pay';
        case 'braintree_paypal':
            return 'paypal';
        case 'braintree_paypal_credit':
            return 'paypal_credit';
        case 'braintree_venmo':
            return 'venmo';
        default:
            return 'other';
        }
    };
});
