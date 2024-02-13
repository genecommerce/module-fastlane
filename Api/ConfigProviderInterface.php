<?php

declare(strict_types=1);

namespace PayPal\Fastlane\Api;

interface ConfigProviderInterface
{
    public const XML_PATH_FASTLANE_IS_ACTIVE = "payment/fastlane/is_active";
    public const XML_PATH_FASTLANE_SHOW_BRANDING = "payment/fastlane/show_branding";
    public const XML_PATH_FASTLANE_SHOW_CARDHOLDER = "payment/fastlane/show_cardholder_name";
    public const XML_PATH_FASTLANE_DEBUG_MODE = "payment/fastlane/debug_mode";

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
