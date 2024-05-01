<?php

declare(strict_types=1);

namespace PayPal\Fastlane\Api;

interface ConfigProviderInterface
{
    public const XML_PATH_FASTLANE_IS_ACTIVE = "payment/fastlane/is_active";
    public const XML_PATH_FASTLANE_PRIVACY = "payment/fastlane/privacy";
    public const XML_PATH_FASTLANE_SHOW_CARDHOLDER = "payment/fastlane/show_cardholder_name";
    public const XML_PATH_FASTLANE_CLIENT_ID = "payment/fastlane/client_id";

    /**
     * @param int|string|null $storeId
     * @return bool
     */
    public function isPayPalConnectActive(int|string|null $storeId = null): bool;

    /**
     * @param int|string|null $storeId
     * @return bool
     */
    public function getShowPrivacy(int|string|null $storeId = null): bool;

    /**
     * @param int|string|null $storeId
     * @return bool
     */
    public function getShowCardholderName(int|string|null $storeId = null): bool;

    /**
     * @param int|string|null $storeId
     * @return string
     */
    public function getClientId(int|string|null $storeId = null): string;
}
