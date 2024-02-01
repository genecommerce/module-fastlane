define(['Magento_Customer/js/customer-data'], function (customerData) {
    'use strict';

    /**
     * Small helper to convert a given region name into the Adobe Commerce region ID.
     */
    return function (countryCode, regionName) {
        const countryData = customerData.get('directory-data'),
            country = countryData()[countryCode];

        if (country?.regions) {
            const regionIds = Object.keys(country.regions);

            return regionIds.find((regionId) => {
                return country.regions[regionId].code === regionName;
            }) || 0;
        }

        return 0;
    };
});
