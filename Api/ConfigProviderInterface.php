<?php

declare(strict_types=1);

namespace PayPal\Fastlane\Api;

interface ConfigProviderInterface
{
    public const XML_PATH_PAYPAL_CONNECT_IS_ACTIVE = "payment/paypal_connect/is_active";
    public const XML_PATH_PAYPAL_CONNECT_SHOW_BRANDING = "payment/paypal_connect/show_branding";
    public const XML_PATH_PAYPAL_CONNECT_SHOW_CARDHOLDER = "payment/paypal_connect/show_cardholder_name";
    public const XML_PATH_PAYPAL_CONNECT_DEBUG_MODE = "payment/paypal_connect/debug_mode";

    /**
     * @param int|string|null $storeId
     * @return bool
     */
    public function isPayPalConnectActive(int|string|null $storeId = null): bool;

    /**
     * @param int|string|null $storeId
     * @return bool
     */
    public function getShowBranding(int|string|null $storeId = null): bool;

    /**
     * @param int|string|null $storeId
     * @return bool
     */
    public function getShowCardholderName(int|string|null $storeId = null): bool;

    /**
     * @param int|string|null $storeId
     * @return bool
     */
    public function isDebugModeEnabled(int|string|null $storeId = null): bool;
}
