define([
    'Magento_Checkout/js/model/new-customer-address',
    'PayPal_Fastlane/js/helpers/get-region-id'
], function (Address, getRegionId) {
    'use strict';

    /**
     * Fastlane provides an address object that isn't in the correct Adobe Commerce format so map it to the
     * correct format.
     *
     * @param {Object} address - An address object as gathered from Fastlane.
     * @returns {Object} - A correctly mapped address using 'Magento_Checkout/js/model/new-customer-address' model.
     */
    return function (address) {
        const mappedAddress = Address({
                region: {
                    region_id: getRegionId(address.countryCodeAlpha2, address.region),
                    region_code: address.region
                },
                company: address.company || '',
                country_id: address.countryCodeAlpha2,
                street: [
                    address.streetAddress
                ],
                firstname: address.firstName || '',
                lastname: address.lastName || '',
                city: address.locality,
                telephone: address.phoneNumber || '',
                postcode: address.postalCode
            }),
            tempStreet = mappedAddress.street;

        if (address.extendedAddress) {
            mappedAddress.street.push(address.extendedAddress);
        }

        mappedAddress.street = {
            0: tempStreet[0],
            1: tempStreet[1] || ''
        };
        mappedAddress.country_id = mappedAddress.countryId;
        mappedAddress.region_code = mappedAddress.regionCode;
        mappedAddress.region_id = mappedAddress.regionId;

        return mappedAddress;
    };
});
