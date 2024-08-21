<?php

declare(strict_types=1);

namespace PayPal\Fastlane\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;
use PayPal\Fastlane\Api\ConfigProviderInterface;

class ConfigProvider implements ConfigProviderInterface
{
    /**
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        private readonly ScopeConfigInterface $scopeConfig
    ) {
    }

    /**
     * Check if extension in enabled
     *
     * @param int|string|null $storeId
     * @return bool
     */
    public function isPayPalFastlaneActive(int|string|null $storeId = null): bool
    {
        return $this->scopeConfig->isSetFlag(
            self::XML_PATH_FASTLANE_IS_ACTIVE,
            ScopeInterface::SCOPE_STORE,
            $storeId
        );
    }

    /**
     * Check if can show privacy
     *
     * @param int|string|null $storeId
     * @return bool
     */
    public function getShowPrivacy(int|string|null $storeId = null): bool
    {
        return $this->scopeConfig->isSetFlag(
            self::XML_PATH_FASTLANE_PRIVACY,
            ScopeInterface::SCOPE_STORE,
            $storeId
        );
    }

    /**
     * Check if can show cardholders name
     *
     * @param int|string|null $storeId
     * @return bool
     */
    public function getShowCardholderName(int|string|null $storeId = null): bool
    {
        return $this->scopeConfig->isSetFlag(
            self::XML_PATH_FASTLANE_SHOW_CARDHOLDER,
            ScopeInterface::SCOPE_STORE,
            $storeId
        );
    }

    /**
     * Get config value by path
     *
     * @param string $path
     * @param int|string|null $storeId
     * @return string
     */
    private function getValue($path, int|string|null $storeId = null): string
    {
        return $this->scopeConfig->getValue(
            $path,
            ScopeInterface::SCOPE_STORE,
            $storeId
        ) ?? '';
    }

    /**
     * Return client ID
     *
     * @param int|string|null $storeId
     * @return string
     */
    public function getClientId(int|string|null $storeId = null): string
    {
        return $this->getValue(self::XML_PATH_FASTLANE_CLIENT_ID);
    }

    /**
     * Return an array with styling config
     *
     * @param int|string|null $storeId
     * @return array
     */
    public function getStyling(int|string|null $storeId = null): array
    {
        return [
            "rootBackgroundColor" => $this->getValue(self::XML_PATH_FASTLANE_STYLING_ROOT_BACKGROUND_COLOR),
            "rootErrorColor" => $this->getValue(self::XML_PATH_FASTLANE_STYLING_ROOT_ERROR_COLOR),
            "rootFontFamily" => $this->getValue(self::XML_PATH_FASTLANE_STYLING_ROOT_FONT_FAMILY),
            "rootFontSize" => $this->getValue(self::XML_PATH_FASTLANE_STYLING_ROOT_FONT_SIZE),
            "rootTextColor" => $this->getValue(self::XML_PATH_FASTLANE_STYLING_ROOT_TEXT_COLOR),
            "rootPadding" => $this->getValue(self::XML_PATH_FASTLANE_STYLING_ROOT_PADDING),
            "rootPrimaryColor" => $this->getValue(self::XML_PATH_FASTLANE_STYLING_ROOT_PRIMARY_COLOR),
            "inputBackgroundColor" => $this->getValue(self::XML_PATH_FASTLANE_STYLING_INPUT_BACKGROUND_COLOR),
            "inputBorderColor" => $this->getValue(self::XML_PATH_FASTLANE_STYLING_INPUT_BORDER_COLOR),
            "inputBorderRadius" => $this->getValue(self::XML_PATH_FASTLANE_STYLING_INPUT_BORDER_RADIUS),
            "inputBorderWidth" => $this->getValue(self::XML_PATH_FASTLANE_STYLING_INPUT_BORDER_WIDTH),
            "inputFocusBorderColor" => $this->getValue(self::XML_PATH_FASTLANE_STYLING_INPUT_FOCUS_BORDER_COLOR),
            "inputTextColor" => $this->getValue(self::XML_PATH_FASTLANE_STYLING_INPUT_TEXT_COLOR)
        ];
    }
}
