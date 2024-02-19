<?php

declare(strict_types=1);

namespace PayPal\Fastlane\ViewModel;

use Magento\Framework\View\Element\Block\ArgumentInterface;
use PayPal\Braintree\Gateway\Config\Config;

class BraintreeConfig implements ArgumentInterface
{
    /**
     * @var Config
     */
    private Config $config;

    /**
     * @param Config $config
     */
    public function __construct(
        Config $config
    ) {
        $this->config = $config;
    }

    /**
     * Get Braintree Merchant ID.
     *
     * @return string
     */
    public function getMerchantId(): string
    {
        return $this->config->getMerchantId();
    }
}
