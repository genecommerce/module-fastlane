<?php
namespace PayPal\Fastlane\Plugin\Model\Ui;

use Magento\Customer\Model\Session;
use Magento\Framework\App\Request\Http;
use PayPal\Braintree\Gateway\Request\PaymentDataBuilder;
use PayPal\Braintree\Gateway\Config\Config as BraintreeConfig;
use PayPal\Braintree\Model\Adapter\BraintreeAdapter;
use Magento\Framework\Exception\InputException;
use Magento\Framework\Exception\NoSuchEntityException;
use PayPal\Braintree\Model\Ui\ConfigProvider as BraintreeConfigProvider;
use PayPal\Fastlane\Model\ConfigProvider;

class ConfigProviderPlugin
{
    public const DOMAINS = 'domains';

    /**
     * @var BraintreeConfig
     */
    private BraintreeConfig $braintreeConfig;

    /**
     * @var BraintreeAdapter
     */
    private BraintreeAdapter $braintreeAdapter;

    /**
     * @var ConfigProvider
     */
    private ConfigProvider $configProvider;

    /**
     * @var Session
     */
    private Session $customerSession;

    /**
     * @var Http
     */
    private Http $httpRequest;

    /**
     * @param BraintreeConfig $braintreeConfig
     * @param BraintreeAdapter $adapter
     * @param ConfigProvider $configProvider
     * @param Session $customerSession
     * @param Http $httpRequest
     */
    public function __construct(
        BraintreeConfig $braintreeConfig,
        BraintreeAdapter $adapter,
        ConfigProvider $configProvider,
        Session $customerSession,
        Http $httpRequest
    ) {
        $this->braintreeConfig = $braintreeConfig;
        $this->braintreeAdapter = $adapter;
        $this->configProvider = $configProvider;
        $this->customerSession = $customerSession;
        $this->httpRequest = $httpRequest;
    }

    /**
     * Generate a new client token with domain parameter
     *
     * @param BraintreeConfigProvider $subject
     * @param $result
     * @return string
     * @throws InputException
     * @throws NoSuchEntityException
     */
    public function afterGetClientToken(BraintreeConfigProvider $subject, $result)
    {
        if ($this->configProvider->isPayPalFastlaneActive()
            && !$this->customerSession->isLoggedIn()
        ) {
            $merchantAccountId = $this->braintreeConfig->getMerchantAccountId();
            if (!empty($merchantAccountId)) {
                $params[PaymentDataBuilder::MERCHANT_ACCOUNT_ID] = $merchantAccountId;
            }

            $params[self::DOMAINS] = [$this->httpRequest->getServer('SERVER_NAME')];

            $result = $this->braintreeAdapter->generate($params);
        }

        return $result;
    }
}
