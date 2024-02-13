define(['Magento_Customer/js/model/customer'], function (customer) {
    'use strict';

    /**
     * Small helper to check if Fastlane is enabled and the User is NOT logged in.
     */
    return function () {
        return window.checkoutConfig.fastlane.is_active && !customer.isLoggedIn();
    };
});
