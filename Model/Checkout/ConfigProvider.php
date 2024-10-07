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
     * Return an array with fastlane config
     *
     * @return array
     */
    public function getConfig(): array
    {
        $config = [
            'fastlane' => [
                'is_active' => $this->configProvider->isPayPalFastlaneActive()
            ]
        ];

        if ($this->configProvider->isPayPalFastlaneActive()) {
            $config['fastlane']['privacy'] = $this->configProvider->getShowPrivacy();
            $config['fastlane']['show_cardholder_name'] = $this->configProvider->getShowCardholderName();
            $config['fastlane']['styling'] = $this->configProvider->getStyling();
        }
        return $config;
    }
}
