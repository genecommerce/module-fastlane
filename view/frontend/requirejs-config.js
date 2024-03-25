var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/view/form/element/email': {
                'PayPal_Fastlane/js/view/form/element/email-mixin': true
            },
            'Magento_Checkout/js/view/shipping-information': {
                'PayPal_Fastlane/js/view/shipping-information-mixin': true
            },
            'PayPal_Braintree/js/view/payment/method-renderer/cc-form': {
                'PayPal_Fastlane/js/view/payment/method-renderer/cc-form-mixin': true
            },
            'PayPal_Braintree/js/view/payment/method-renderer/hosted-fields': {
                'PayPal_Fastlane/js/view/payment/method-renderer/hosted-fields-mixin': true
            }
        }
    },

    map: {
        '*': {
            braintree: 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/client.js'
        }
    },

    paths: {
        'braintreePayPalCheckout':
            'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/paypal-checkout',
        'braintreeHostedFields': 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/hosted-fields',
        'braintreeDataCollector': 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/data-collector',
        'braintreeThreeDSecure': 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/three-d-secure',
        'braintreeApplePay': 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/apple-pay',
        'braintreeGooglePay': 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/google-payment',
        'braintreeVenmo': 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/venmo',
        'braintreeAch': 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/us-bank-account',
        'braintreeLpm': 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/local-payment',
        'braintreeFastlane': 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/fastlane',
        'payPalInsights': 'https://www.paypalobjects.com/insights/v1/paypal-insights.sandbox'
    }
};
