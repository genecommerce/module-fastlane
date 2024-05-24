<?php

declare(strict_types=1);

namespace PayPal\Fastlane\Plugin;

use Closure;
use Magento\Framework\DB\Select;
use Magento\Framework\View\Element\UiComponent\DataProvider\SearchResult;

class OrderGridFilter
{
    /**
     * Add the condition to check for Fastlane use.
     *
     * @param SearchResult $subject
     * @param Closure $proceed
     * @param string $field
     * @param array|null $condition
     * @return SearchResult|mixed
     */
    public function aroundAddFieldToFilter(
        SearchResult $subject,
        Closure      $proceed,
        $field,
        $condition = null
    ): mixed {
        if ($field === 'additional_information') {
            if (!empty($condition)) {
                $filter = ['like' => "%\"fastlane\":\"{$condition['eq']}\"%"];
                $condition = $subject->getConnection()->prepareSqlCondition('sop.additional_information', $filter);
                $resource = $subject->getResource();
                $subject->getSelect()->joinLeft(
                    ['sop' => $resource->getTable('sales_order_payment')],
                    'sop.entity_id = main_table.entity_id',
                    ['additional_information']
                );
                $subject->getSelect()->where($condition, null, Select::TYPE_CONDITION);
            }

            return $subject;
        }

        return $proceed($field, $condition);
    }
}
