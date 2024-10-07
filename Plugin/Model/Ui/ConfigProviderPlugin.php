<?php
namespace PayPal\Fastlane\Plugin\Model\Ui;

use Magento\Customer\Model\Session;
use Magento\Framework\App\Request\Http;
use Magento\Store\Model\StoreManagerInterface;
use PayPal\Braintree\Gateway\Request\PaymentDataBuilder;
use PayPal\Braintree\Gateway\Config\Config as BraintreeConfig;
use PayPal\Fastlane\Model\Adapter\BraintreeAdapter;
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
    private BraintreeAdapter $adapter;

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
     * @var StoreManagerInterface
     */
    private StoreManagerInterface $storeManager;

    /**
     * @param BraintreeConfig $braintreeConfig
     * @param BraintreeAdapter $adapter
     * @param ConfigProvider $configProvider
     * @param Session $customerSession
     * @param Http $httpRequest
     * @param StoreManagerInterface $storeManager
     */
    public function __construct(
        BraintreeConfig $braintreeConfig,
        BraintreeAdapter $adapter,
        ConfigProvider $configProvider,
        Session $customerSession,
        Http $httpRequest,
        StoreManagerInterface $storeManager
    ) {
        $this->braintreeConfig = $braintreeConfig;
        $this->adapter = $adapter;
        $this->configProvider = $configProvider;
        $this->customerSession = $customerSession;
        $this->httpRequest = $httpRequest;
        $this->storeManager = $storeManager;
    }

    /**
     * Generate a new client token with 'domains' parameter
     *
     * @param BraintreeConfigProvider $subject
     * @param string $result
     * @return string
     * @throws InputException
     * @throws NoSuchEntityException
     */
    public function afterGetClientToken(BraintreeConfigProvider $subject, $result)
    {
        $storeId = $this->storeManager->getStore()->getId();
        if ($this->configProvider->isPayPalFastlaneActive($storeId)
            && !$this->customerSession->isLoggedIn()
        ) {
            $merchantAccountId = $this->braintreeConfig->getMerchantAccountId();
            if (!empty($merchantAccountId)) {
                $params[PaymentDataBuilder::MERCHANT_ACCOUNT_ID] = $merchantAccountId;
            }

            $params[self::DOMAINS] = [$this->httpRequest->getServer('HTTP_HOST')];

            $result = $this->adapter->generate($params);
        }

        return $result;
    }
}
