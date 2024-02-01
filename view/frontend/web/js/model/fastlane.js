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
        runningSetup: null,

        getClientToken: function () {
            return window.checkoutConfig.payment.braintree.clientToken;
        },

        createClientInstance: async function () {
            this.clientInstance = await client.create({
                authorization: this.getClientToken()
            });

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
            if (this.runningSetup) {
                return this.runningSetup;
            }

            this.runningSetup = new Promise(async (resolve) => {
                if (!this.clientInstance) {
                    await this.createClientInstance();
                }

                if (!this.fastlaneInstance) {
                    await this.createFastlaneInstance();
                }

                resolve();
            });

            return this.runningSetup;
        },

        lookupCustomerByEmail: function (email) {
            return this.fastlaneInstance.identity.lookupCustomerByEmail(email);
        },

        triggerAuthenticationFlow: function (customerContextId) {
            return this.fastlaneInstance.identity.triggerAuthenticationFlow(customerContextId);
        },

        renderConnectCardComponent: function (selector) {
            if (this.fastlaneInstance) {
                this.fastlaneInstance.ConnectCardComponent().render(selector);
            }
        },

        renderConnectWatermarkComponent: function (selector) {
            if (this.fastlaneInstance) {
                this.fastlaneInstance.ConnectWatermarkComponent({
                    includeAdditionalInfo: true
                }).render(selector);
            }
        }
    };
});
