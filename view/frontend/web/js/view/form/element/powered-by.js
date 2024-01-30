define([
    'uiComponent',
    'PayPal_Fastlane/js/model/fastlane'
], function (Component, fastlaneModel) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'PayPal_Fastlane/form/element/powered-by'
        },

        /**
         * Initialise the watermark component.
         *
         * @returns {Object} Chainable.
         */
        initConfig: async function () {
            this._super();

            // TODO: Check the window.checkoutConfig to see if branding is enabled.
            await fastlaneModel.setup();

            fastlaneModel.renderConnectWatermarkComponent('#paypal-fastlane-powered-by');

            return this;
        }
    });
});
