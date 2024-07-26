<?php

declare(strict_types=1);

namespace PayPal\Fastlane\Plugin\CustomerData;

use Magento\Checkout\CustomerData\Cart as Subject;
use Magento\Checkout\Model\Session;
use Magento\Quote\Model\QuoteIdToMaskedQuoteIdInterface;

class Cart
{
    public const GUEST_MASKED_ID_KEY = 'guest_masked_id';

    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * @var QuoteIdToMaskedQuoteIdInterface
     */
    private $maskedQuote;

    /**
     * Cart constructor
     *
     * @param Session $checkoutSession
     * @param QuoteIdToMaskedQuoteIdInterface $maskedQuote
     */
    public function __construct(
        Session $checkoutSession,
        QuoteIdToMaskedQuoteIdInterface $maskedQuote,
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->maskedQuote = $maskedQuote;
    }

    /**
     * Intercept getSectionData and add guest masked ID if available.
     *
     * @param Subject $subject
     * @param array $result
     * @return array
     */
    public function afterGetSectionData(
        Subject $subject,
        array $result
    ): array {
        $quote = $this->checkoutSession->getQuote();
        $quoteId = $this->checkoutSession->getQuoteId();

        if ($quote &&
            !$quote->getCustomerId() &&
            $quoteId != null) {
            $maskedId = $this->maskedQuote->execute((int)$quoteId);
            $result[self::GUEST_MASKED_ID_KEY] = $maskedId;
        }

        return $result;
    }
}
