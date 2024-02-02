define(['PayPal_Fastlane/js/model/fastlane'] ,function (fastlaneModel) {
    'use strict';

    var mixin = {
        /**
         * @returns {exports.initialize}
         */
        initialize: function () {
            this._super();
            this.template = 'PayPal_Fastlane/payment/fastlane';
            return this;
        },

        placeOrderClick: function () {
            console.log('placeOrder');
        },

        changePayment: function () {
            fastlaneModel.displayChangeCard();
        }
    };

    return function (target) { // target == Result that Magento_Ui/.../columns returns.
        return target.extend(mixin); // new result that all other modules receive
    };
});
