define([
    'Magento_Checkout/js/model/step-navigator',
    'PayPal_Fastlane/js/helpers/add-insights-event',
    'PayPal_Fastlane/js/helpers/is-fastlane-available',
    'PayPal_Fastlane/js/model/fastlane'
], function (stepsNavigator, addInsightsEvent, isFastlaneAvailable, fastlaneModel) {
    'use strict';

    var mixin = {
        shippingServiceSubscription: null,

        /**
         * Add mixin to the checkEmailAvailability so we can trigger Fastlane.
         */
        checkEmailAvailability: async function () {
            this._super();

            // Early return if Fastlane is not available
            if (!isFastlaneAvailable()) {
                return;
            }

            // Early return if we are already on the payment page.
            if (stepsNavigator.getActiveItemIndex() !== 0) {
                return;
            }

            await fastlaneModel.setup();

            // Check the entered email against Fastlane to see if we have an account.
            fastlaneModel.lookupCustomerByEmail(this.email());

            addInsightsEvent('event', 'submit_checkout_email');
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});
