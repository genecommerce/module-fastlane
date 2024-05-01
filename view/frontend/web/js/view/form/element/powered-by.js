define([
    'knockout',
    'uiComponent',
    'PayPal_Fastlane/js/helpers/is-branding-enabled',
    'PayPal_Fastlane/js/helpers/is-fastlane-available',
    'PayPal_Fastlane/js/model/fastlane'
], function (ko, Component, isBrandingEnabled, isFastlaneAvailable, fastlaneModel) {
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
            this._super(config);

            this.id = config.id;
            this.profileData = fastlaneModel.profileData;
            this.isVisible = ko.observable(false);

            return this;
        },

        shouldRenderWatermark: async function () {
            // Early return if Fastlane is not available.
            if (!isFastlaneAvailable()) {
                return false;
            }

            await fastlaneModel.setup();

            // Fastlane Watermark should be rendered based on the following:
            //   - Email watermark is based on the branding configuration
            //   - All others are based on whether we have profile data
            const shouldRender = this.id === 'paypal-fastlane-email-watermark' && isBrandingEnabled()
                || this.id !== 'paypal-fastlane-email-watermark' && !!this.profileData();

            this.isVisible(shouldRender);
        },

        renderWatermark: async function () {
            await this.shouldRenderWatermark();

            if (this.isVisible()) {
                fastlaneModel.renderConnectWatermarkComponent(`#${this.id}`);
            }
        }
    });
});
