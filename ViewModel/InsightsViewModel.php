<?php

declare(strict_types=1);

namespace PayPal\Fastlane\ViewModel;

use Magento\Framework\View\Element\Block\ArgumentInterface;
use PayPal\Braintree\Gateway\Config\Config as BraintreeConfig;
use PayPal\Fastlane\Api\ConfigProviderInterface;

class InsightsViewModel implements ArgumentInterface
{
    /**
     * @param BraintreeConfig $config
     */
    public function __construct(
        private readonly BraintreeConfig $braintreeConfig,
        private readonly ConfigProviderInterface $configProvider
    ) {
    }

    /**
     * Get Braintree Merchant ID.
     *
     * @return string
     */
    public function getMerchantId(): string
    {
        return $this->braintreeConfig->getMerchantId();
    }

    /**
     * Get the Braintree Client ID.
     *
     * @return string
     */
    public function getClientId(): string
    {
        return $this->configProvider->getClientId();
    }
}
