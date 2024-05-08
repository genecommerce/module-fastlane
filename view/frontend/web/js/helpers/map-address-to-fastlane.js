define(function () {
    'use strict';

    /**
     * Formats an address object back to the format expected by Fastlane.
     *
     * @param {Object} address - Address that ideally is a 'Magento_Checkout/js/model/new-customer-address' object.
     * @returns {Object} - A correctly mapped address that is expected by Fastlane.
     */
    return function (address) {
        return {
            firstName: address.firstname,
            lastName: address.lastname,
            company: address.company,
            streetAddress: address.street[0],
            extendedAddress: address.street[1],
            locality: address.city,
            region: address.regionCode,
            postalCode: address.postcode,
            countryCodeAlpha2: address.countryId,
            phoneNumber: address.telephone
        };
    };
});
