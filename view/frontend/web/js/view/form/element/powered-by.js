define([
    'uiComponent',
    'Magento_Customer/js/model/customer',
    'PayPal_Fastlane/js/model/fastlane'
], function (Component, customer, fastlaneModel) {
    'use strict';

    return Component.extend({
        profileData: null,

        defaults: {
            template: 'PayPal_Fastlane/form/element/powered-by'
        },

        /**
         * Initialise the watermark component.
         *
         * @returns {Object} Chainable.
         */
        initialize: function (config) {
            this._super();

            this.id = config.id;
            this.profileData = fastlaneModel.profileData;

            return this;
        },

        renderWatermark: async function () {
            // Early return if the customer is logged in.
            if (customer.isLoggedIn()) {
                return false;
            }

            await fastlaneModel.setup();
            // Check that the User is using Fastlane before rendering the shipping powered by component.
            if (this.id === 'paypal-fastlane-shipping-watermark' && !this.profileData()) {
                return;
            }

            fastlaneModel.renderConnectWatermarkComponent(`#${this.id}`);
        }
    });
});
