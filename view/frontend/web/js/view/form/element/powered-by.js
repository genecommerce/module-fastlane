define([
    'uiComponent',
    'PayPal_Fastlane/js/helpers/is-branding-enabled',
    'PayPal_Fastlane/js/helpers/is-fastlane-available',
    'PayPal_Fastlane/js/model/fastlane'
], function (Component, isBrandingEnabled, isFastlaneAvailable, fastlaneModel) {
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
            // Early return if branding is disabled.
            if (!isBrandingEnabled()) {
                return;
            }

            // Early return if Fastlane is not available.
            if (!isFastlaneAvailable()) {
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
