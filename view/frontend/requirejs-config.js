var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/view/form/element/email': {
                'PayPal_Fastlane/js/view/form/element/email-mixin': true
            },
            'PayPal_Braintree/js/view/payment/adapter': {
                'PayPal_Fastlane/js/view/payment/adapter-mixin': true
            },
            'PayPal_Braintree/js/view/payment/method-renderer/hosted-fields': {
                'PayPal_Fastlane/js/view/payment/method-renderer/hosted-fields-mixin': true
            }
        }
    },

    map: {
        '*': {
            braintree: 'https://js.braintreegateway.com/web/3.97.4-connect-alpha.6.3/js/client.min.js'
        }
    },

    paths: {
        'braintreePayPalCheckout':
            'https://js.braintreegateway.com/web/3.97.4-connect-alpha.6.3/js/paypal-checkout.min',
        'braintreeHostedFields': 'https://js.braintreegateway.com/web/3.97.4-connect-alpha.6.3/js/hosted-fields.min',
        'braintreeDataCollector': 'https://js.braintreegateway.com/web/3.97.4-connect-alpha.6.3/js/data-collector.min',
        'braintreeThreeDSecure': 'https://js.braintreegateway.com/web/3.97.4-connect-alpha.6.3/js/three-d-secure.min',
        'braintreeApplePay': 'https://js.braintreegateway.com/web/3.97.4-connect-alpha.6.3/js/apple-pay.min',
        'braintreeGooglePay': 'https://js.braintreegateway.com/web/3.97.4-connect-alpha.6.3/js/google-payment.min',
        'braintreeVenmo': 'https://js.braintreegateway.com/web/3.97.4-connect-alpha.6.3/js/venmo.min',
        'braintreeAch': 'https://js.braintreegateway.com/web/3.97.4-connect-alpha.6.3/js/us-bank-account.min',
        'braintreeLpm': 'https://js.braintreegateway.com/web/3.97.4-connect-alpha.6.3/js/local-payment.min',
        'braintreeFastlane': 'https://js.braintreegateway.com/web/3.97.4-connect-alpha.6.3/js/connect.min'
    }
};
