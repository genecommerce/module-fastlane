<?php

declare(strict_types=1);

namespace PayPal\Fastlane\Api;

interface ConfigProviderInterface
{
    public const XML_PATH_FASTLANE_IS_ACTIVE = "payment/fastlane/is_active";
    public const XML_PATH_FASTLANE_PRIVACY = "payment/fastlane/privacy";
    public const XML_PATH_FASTLANE_SHOW_CARDHOLDER = "payment/fastlane/show_cardholder_name";
    public const XML_PATH_FASTLANE_CLIENT_ID = "payment/fastlane/client_id";
    public const XML_PATH_FASTLANE_STYLING_ROOT_BACKGROUND_COLOR = "payment/fastlane/root_background_color";
    public const XML_PATH_FASTLANE_STYLING_ROOT_ERROR_COLOR = "payment/fastlane/root_error_color";
    public const XML_PATH_FASTLANE_STYLING_ROOT_FONT_FAMILY = "payment/fastlane/root_font_family";
    public const XML_PATH_FASTLANE_STYLING_ROOT_FONT_SIZE = "payment/fastlane/root_font_size";
    public const XML_PATH_FASTLANE_STYLING_ROOT_TEXT_COLOR = "payment/fastlane/root_text_color";
    public const XML_PATH_FASTLANE_STYLING_ROOT_PADDING = "payment/fastlane/root_padding";
    public const XML_PATH_FASTLANE_STYLING_ROOT_PRIMARY_COLOR = "payment/fastlane/root_primary_color";
    public const XML_PATH_FASTLANE_STYLING_INPUT_BACKGROUND_COLOR = "payment/fastlane/input_background_color";
    public const XML_PATH_FASTLANE_STYLING_INPUT_BORDER_COLOR = "payment/fastlane/input_border_color";
    public const XML_PATH_FASTLANE_STYLING_INPUT_BORDER_RADIUS = "payment/fastlane/input_border_radius";
    public const XML_PATH_FASTLANE_STYLING_INPUT_BORDER_WIDTH = "payment/fastlane/input_border_width";
    public const XML_PATH_FASTLANE_STYLING_INPUT_FOCUS_BORDER_COLOR = "payment/fastlane/input_focus_border_color";
    public const XML_PATH_FASTLANE_STYLING_INPUT_TEXT_COLOR = "payment/fastlane/input_text_color";

    /**
     * @param int|string|null $storeId
     * @return bool
     */
    public function isPayPalFastlaneActive(int|string|null $storeId = null): bool;

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

    /**
     * @param int|string|null $storeId
     * @return array
     */
    public function getStyling(int|string|null $storeId = null): array;
}
