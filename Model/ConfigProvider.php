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
     * @param int|string|null $storeId
     * @return bool
     */
    public function isPayPalConnectActive(int|string|null $storeId = null): bool
    {
        return $this->scopeConfig->isSetFlag(
            self::XML_PATH_PAYPAL_CONNECT_IS_ACTIVE,
            ScopeInterface::SCOPE_STORE,
            $storeId
        );
    }

    /**
     * @param int|string|null $storeId
     * @return bool
     */
    public function getShowBranding(int|string|null $storeId = null): bool
    {
        return $this->scopeConfig->isSetFlag(
            self::XML_PATH_PAYPAL_CONNECT_SHOW_BRANDING,
            ScopeInterface::SCOPE_STORE,
            $storeId
        );
    }

    /**
     * @param int|string|null $storeId
     * @return bool
     */
    public function isDebugModeEnabled(int|string|null $storeId = null): bool
    {
        return $this->scopeConfig->isSetFlag(
            self::XML_PATH_PAYPAL_CONNECT_DEBUG_MODE,
            ScopeInterface::SCOPE_STORE,
            $storeId
        );
    }
}
