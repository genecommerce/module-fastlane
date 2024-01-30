define([
    'braintree',
    'braintreeDataCollector',
    'braintreeFastlane'
], function (client, dataCollector, brainteeFastlane) {
    'use strict';

    return {
        clientInstance: null,
        fastlaneInstance: null,
        deviceData: null,

        getClientToken: function () {
            return window.checkoutConfig.payment.braintree.clientToken;
        },

        createClientInstance: async function () {
            const clientInstance = await client.create({
                authorization: this.getClientToken()
            });

            this.clientInstance = clientInstance;

            return this.createDataCollectorInstance(this.clientInstance);
        },

        createDataCollectorInstance: async function (clientInstance) {
            const options = {
                    client: clientInstance
                },
                dataCollectorInstance = await dataCollector.create(options);

            this.deviceData = dataCollectorInstance.deviceData;
        },

        createFastlaneInstance: async function () {
            this.fastlaneInstance = await brainteeFastlane.create({
                authorization: this.getClientToken(),
                client: this.clientInstance,
                deviceData: this.deviceData
            });
        },

        setup: async function () {
            if (!this.clientInstance) {
                await this.createClientInstance();
            }

            if (!this.fastlaneInstance) {
                await this.createFastlaneInstance();
            }
        },

        lookupCustomerByEmail: function (email) {
            return this.fastlaneInstance.identity.lookupCustomerByEmail(email);
        },

        triggerAuthenticationFlow: function (customerContextId) {
            return this.fastlaneInstance.identity.triggerAuthenticationFlow(customerContextId);
        },

        connectCardComponent: function (id) {
            this.fastlaneInstance.ConnectCardComponent().render(id);
        }
    };
});
