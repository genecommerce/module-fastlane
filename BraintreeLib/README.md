# Inclusion of Braintree PHP SDK - v6.18.0

This Library has been scoped tightly in this extension to maintain the compatibility and will only allow PayPal_Fastlane extension to use this specific Braintree PHP SDK version(v6.18.0), utilise the magento composer autoloader.

As this library is only being used to create the client token with 'domains' parameter, so we have included files which are responsible for validating credentials and generating client token.

Unnecessary files have been removed from this library to avoid conflicts with other ones.

Adobe Commerce is bundling up Braintree PHP SDK to v6.13.0 and locking it there that's why it can not be upgraded to the latest version which leads us to include this into PayPal_Fastlane extension.
