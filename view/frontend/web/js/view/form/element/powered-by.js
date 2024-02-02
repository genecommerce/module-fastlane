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
        initConfig: async function (config) {
            this._super();

            this.id = config.id;

            return this;
        },

        renderWatermark: async function () {
            await fastlaneModel.setup();
            fastlaneModel.renderConnectWatermarkComponent(`#${this.id}`);
        }
    });
});
