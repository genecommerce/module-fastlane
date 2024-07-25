[![CircleCI](https://dl.circleci.com/status-badge/img/gh/genecommerce/module-fastlane/tree/master.svg?style=svg&circle-token=CCIPRJ_Q9hpNWjDxYjcxXcJxk3gnj_120e05062d2f89081dd1264f656737bdc3b10c4f)](https://dl.circleci.com/status-badge/redirect/gh/genecommerce/module-fastlane/tree/master)

# PayPal_Fastlane module

The PayPal_Fastlane module integrates Fastlane by PayPal with the Braintree integration.

When enabled the PayPal_Fastlane module replaces the Braintree card payment component with the Fastlane component allowing User's to checkout with Fastlane.

## Installation details

PayPal_Fastlane follows the standard installation process for Magento 2.

For information about a module installation in Magento 2, see [Enable or disable modules](https://experienceleague.adobe.com/docs/commerce-operations/installation-guide/tutorials/manage-modules.html).

## Compatibility

PayPal_Fastlane supports the following version of Magento 2:

- 2.4.4-p9
- 2.4.5-p8
- 2.4.6-p6
- 2.4.7-p1

This module will update the Braintree SDK version used across the entire checkout to version `3.104.0` for Fastlane support. This may have compatibility concerns for third party modules using the Braintree SDK for other features.

## Support

For further support please refer to the [support portal](https://fastlane-support.gene.co.uk) or email [fastlane-support@gene.co.uk](mailto:fastlane-support@gene.co.uk).
