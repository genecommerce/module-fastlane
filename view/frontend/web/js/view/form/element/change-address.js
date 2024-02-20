define([
    'uiComponent',
    'PayPal_Fastlane/js/model/fastlane'
], function (Component, fastlaneModel) {
    'use strict';

    return Component.extend({
        profileData: null,

        defaults: {
            template: 'PayPal_Fastlane/form/element/change-address'
        },

        /**
         * Initialise the change address component.
         *
         * @returns {Object} Chainable.
         */
        initialize: function () {
            this._super();

            this.profileData = fastlaneModel.profileData;

            return this;
        },

        /**
         * Display the shipping address modal from Fastlane.
         *
         * @returns {void}
         */
        displayChangeShipping: async function () {
            fastlaneModel.displayChangeShipping();
        }
    });
});
