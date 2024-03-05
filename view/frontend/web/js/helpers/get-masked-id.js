define([
    'Magento_Customer/js/customer-data'
], function (customerData) {
    'use strict';

    /**
     * Helper to get the masked ID from cart storage if it exists.
     */
    return function () {
        const cart = customerData.get('cart')();

        return cart.guest_masked_id;
    };
});
