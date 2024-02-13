<?php

declare(strict_types=1);

namespace PayPal\Fastlane\Model\Checkout;

use Magento\Checkout\Model\ConfigProviderInterface as CheckoutConfigProviderInterface;
use PayPal\Fastlane\Api\ConfigProviderInterface;

class ConfigProvider implements CheckoutConfigProviderInterface
{
    /**
     * @param ConfigProviderInterface $configProvider
     */
    public function __construct(
        private readonly ConfigProviderInterface $configProvider
    ) {
    }

    /**
     * @return array
     */
    public function getConfig(): array
    {
        if (!$this->configProvider->isPayPalConnectActive()) {
            return [];
        }

        return [
            'fastlane' => [
                'show_branding' => $this->configProvider->getShowBranding(),
                'show_cardholder_name' => $this->configProvider->getShowCardholderName()
            ]
        ];
    }
}
