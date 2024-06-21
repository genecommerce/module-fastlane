<?php

namespace PayPal\Fastlane\BraintreeLib\Braintree\Exception;

use PayPal\Fastlane\BraintreeLib\Braintree\Exception;

/**
 * Raised when the webhook notification you attempt to parse has an invalid signature.
 *
 * @link https://developer.paypal.com/braintree/docs/reference/general/exceptions/php#invalid-signature
 */
class InvalidSignature extends Exception
{
}
