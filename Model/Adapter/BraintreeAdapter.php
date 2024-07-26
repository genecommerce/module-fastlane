<?php
namespace PayPal\Fastlane\Model\Adapter;

use Exception;
use PayPal\Braintree\Gateway\Config\Config as BraintreeConfig;
use PayPal\Braintree\Model\Adminhtml\Source\Environment;
use PayPal\Braintree\Model\StoreConfigResolver;
use Magento\Framework\Exception\InputException;
use Magento\Framework\Exception\NoSuchEntityException;
use PayPal\Fastlane\BraintreeLib\Braintree\ClientToken;
use PayPal\Fastlane\BraintreeLib\Braintree\Configuration;
use Psr\Log\LoggerInterface;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class BraintreeAdapter
{
    /**
     * @var BraintreeConfig
     */
    private BraintreeConfig $braintreeConfig;

    /**
     * @var StoreConfigResolver
     */
    private StoreConfigResolver $storeConfigResolver;

    /**
     * @var LoggerInterface
     */
    private LoggerInterface $logger;

    /**
     * @param BraintreeConfig $braintreeConfig
     * @param StoreConfigResolver $storeConfigResolver
     * @param LoggerInterface $logger
     * @throws InputException
     * @throws NoSuchEntityException
     */
    public function __construct(
        BraintreeConfig $braintreeConfig,
        StoreConfigResolver $storeConfigResolver,
        LoggerInterface $logger
    ) {
        $this->braintreeConfig = $braintreeConfig;
        $this->storeConfigResolver = $storeConfigResolver;
        $this->logger = $logger;

        $this->initCredentials();
    }

    /**
     * Initializes credentials.
     *
     * @return void
     *
     * @throws InputException
     * @throws NoSuchEntityException
     */
    protected function initCredentials()
    {
        $storeId = $this->storeConfigResolver->getStoreId();
        $environmentIdentifier = $this->braintreeConfig->getValue(BraintreeConfig::KEY_ENVIRONMENT, $storeId);

        $this->environment(Environment::ENVIRONMENT_SANDBOX);

        $merchantId = $this->braintreeConfig->getValue(BraintreeConfig::KEY_SANDBOX_MERCHANT_ID, $storeId);
        $publicKey = $this->braintreeConfig->getValue(BraintreeConfig::KEY_SANDBOX_PUBLIC_KEY, $storeId);
        $privateKey = $this->braintreeConfig->getValue(BraintreeConfig::KEY_SANDBOX_PRIVATE_KEY, $storeId);

        if ($environmentIdentifier === Environment::ENVIRONMENT_PRODUCTION) {
            $this->environment(Environment::ENVIRONMENT_PRODUCTION);

            $merchantId = $this->braintreeConfig->getValue(BraintreeConfig::KEY_MERCHANT_ID, $storeId);
            $publicKey = $this->braintreeConfig->getValue(BraintreeConfig::KEY_PUBLIC_KEY, $storeId);
            $privateKey = $this->braintreeConfig->getValue(BraintreeConfig::KEY_PRIVATE_KEY, $storeId);
        }

        $this->merchantId($merchantId);
        $this->publicKey($publicKey);
        $this->privateKey($privateKey);
    }

    /**
     * Init environment
     *
     * @param string|null $value
     * @return mixed
     */
    public function environment(string $value = null)
    {
        return Configuration::environment($value);
    }

    /**
     * Init merchant id
     *
     * @param string|null $value
     * @return mixed
     */
    public function merchantId(string $value = null)
    {
        return Configuration::merchantId($value);
    }

    /**
     * Init public key
     *
     * @param string|null $value
     * @return mixed
     */
    public function publicKey(string $value = null)
    {
        return Configuration::publicKey($value);
    }

    /**
     * Init private key
     *
     * @param string|null $value
     * @return mixed
     */
    public function privateKey($value = null)
    {
        return Configuration::privateKey($value);
    }

    /**
     * Generate client token
     *
     * @param array $params
     * @return string
     */
    public function generate(array $params = [])
    {
        try {
            return ClientToken::generate($params);
        } catch (Exception $e) {
            $this->logger->error($e->getMessage());
            return '';
        }
    }
}
