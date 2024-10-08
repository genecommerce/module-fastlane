define([
    'PayPal_Fastlane/js/helpers/is-fastlane-available',
    'PayPal_Fastlane/js/model/fastlane'
], function (isFastlaneAvailable, fastlaneModel) {
    'use strict';

    var mixin = {
        initialize: function () {
            this._super();

            // Early return if Fastlane is not available
            if (!isFastlaneAvailable()) {
                return;
            }

            fastlaneModel.setup();

            return this;
        },

        /**
         * Override the core back behaviour to call Fastlane if required.
         */
        back: function () {
            if (fastlaneModel.profileData()) {
                fastlaneModel.displayChangeShipping();
            } else {
                this._super();
            }
        }
    };

    return function (shippingInformation) {
        return shippingInformation.extend(mixin);
    };
});
