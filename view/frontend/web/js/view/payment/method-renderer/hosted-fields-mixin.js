define([
    'Magento_Checkout/js/model/payment/additional-validators',
    'PayPal_Fastlane/js/helpers/is-fastlane-available',
    'PayPal_Fastlane/js/model/fastlane'
] ,function (additionalValidators, isFastlaneAvailable, fastlaneModel) {
    'use strict';

    var mixin = {
        profileData: null,

        /**
         * Override the hosted fields creation to change the template to Fastlane if it's enabled.
         *
         * @returns {exports.initialize}
         */
        initialize: function () {
            this._super();

            // Early return if Fastlane is not available.
            if (!isFastlaneAvailable()) {
                return this;
            }

            this.template = 'PayPal_Fastlane/payment/fastlane';
            this.profileData = fastlaneModel.profileData;

            return this;
        },

        placeOrderClick: async function () {
            // If Fastlane is not available then run the standard hosted fields order.
            if (!isFastlaneAvailable()) {
                return this._super();
            }

            if (additionalValidators.validate()) {
                this.placeOrder();
            }
        },

        changePayment: function () {
            fastlaneModel.displayChangeCard();
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});
