<?php
namespace PayPal\Fastlane\Observer;

use Magento\Framework\Event\Observer;
use Magento\Payment\Observer\AbstractDataAssignObserver;
use Magento\Quote\Api\Data\PaymentInterface;

class DataAssignObserver extends AbstractDataAssignObserver
{
    public const FASTLANE = 'fastlane';

    /**
     * Assign Fastlane state to additional payment information
     *
     * @param Observer $observer
     * @return void
     */
    public function execute(Observer $observer)
    {
        $data = $this->readDataArgument($observer);

        $additionalData = $data->getData(PaymentInterface::KEY_ADDITIONAL_DATA);
        if (!is_array($additionalData)) {
            return;
        }

        $paymentInfo = $this->readPaymentModelArgument($observer);

        if (isset($additionalData[self::FASTLANE])) {
            $paymentInfo->setAdditionalInformation(
                self::FASTLANE,
                $additionalData[self::FASTLANE]
            );
        }
    }
}
