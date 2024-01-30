define([
    'PayPal_Fastlane/js/model/fastlane'
], function (fastlaneModel) {
    'use strict';

    var mixin = {
        checkEmailAvailability: async function () {
            this._super();

            window.localStorage.setItem('axoEnv', window.checkoutConfig.payment?.braintree?.environment);

            await fastlaneModel.setup();
            const { customerContextId } = await fastlaneModel.lookupCustomerByEmail(this.email());

            if (customerContextId) {
                const { profileData } = await fastlaneModel.triggerAuthenticationFlow(customerContextId);

                console.log(profileData);
            }
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});
