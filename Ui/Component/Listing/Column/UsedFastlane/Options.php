<?php

declare(strict_types=1);

namespace PayPal\Fastlane\Ui\Component\Listing\Column\UsedFastlane;

use Magento\Framework\Data\OptionSourceInterface;

class Options implements OptionSourceInterface
{
    public const USED_FASTLANE_YES = 'Yes';
    public const USED_FASTLANE_NO = 'No';

    /**
     * @var array
     */
    private array $options;

    /**
     * @return array
     */
    public function toOptionArray(): array
    {
        if (!empty($this->options)) {
            return $this->options;
        }

        $this->options = [
            [
                'label' => ' ',
                'value' => '',
            ],
            [
                'label' => self::USED_FASTLANE_YES,
                'value' => self::USED_FASTLANE_YES,
            ],
            [
                'label' => self::USED_FASTLANE_NO,
                'value' => self::USED_FASTLANE_NO,
            ]
        ];

        return $this->options;
    }
}
