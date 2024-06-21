<?php

namespace PayPal\Fastlane\BraintreeLib\Braintree\Exception;

use PayPal\Fastlane\BraintreeLib\Braintree\Exception;

/**
 * Raised when authorization fails
 * Raised when the API key being used is not authorized to perform
 * the attempted action according to the roles assigned to the user
 * who owns the API key.
 */
class Authorization extends Exception
{
}
