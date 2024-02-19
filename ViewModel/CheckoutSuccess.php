<?php

declare(strict_types=1);

namespace PayPal\Fastlane\ViewModel;

use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Customer\Model\Session as CustomerModelSession;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Quote\Model\QuoteIdToMaskedQuoteIdInterface;

class CheckoutSuccess implements ArgumentInterface
{
    /**
     * @var CheckoutSession
     */
    private $checkoutSession;

    /**
     * @var CustomerModelSession
     */
    protected $customerSession;

    /**
     * @var QuoteIdToMaskedQuoteIdInterface
     */
    private $maskedQuote;

    /**
     * @param CheckoutSession $checkoutSession
     * @param CustomerModelSession $customerSession
     * @param QuoteIdToMaskedQuoteIdInterface $maskedQuote
     */
    public function __construct(
        CheckoutSession $checkoutSession,
        CustomerModelSession $customerSession,
        QuoteIdToMaskedQuoteIdInterface $maskedQuote,
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->customerSession = $customerSession;
        $this->maskedQuote = $maskedQuote;
    }

    /**
     * Returns an array containing information about the last User if that User was a guest.
     *
     * @return array
     */
    public function getLastOrderData(): array
    {
        if ($this->customerSession->isLoggedIn()) {
            return [];
        }

        $order = $this->checkoutSession->getLastRealOrder();
        $payment = $order->getPayment();
        $quoteId = $order->getQuoteId();

        $maskedId = $this->maskedQuote->execute((int)$quoteId);

        return [
            'currencyCode' => $order->getOrderCurrencyCode(),
            'maskedId' => $maskedId,
            'method' => $payment->getMethod(),
            'value' => $order->getGrandTotal(),
        ];
    }
}
