define(function () {
    'use strict';

    /**
     * Small helper to check the status of the Fastlane branding.
     */
    return function () {
        return window.checkoutConfig.fastlane.show_branding;
    };
});
