define(['uiRegistry'], function (uiRegistry) {
    'use strict';

    return function () {
        const regions = uiRegistry.get('checkoutProvider').get('dictionaries.region_id'),
            allowedLocations = Object.values(regions).map(({ country_id }) => country_id).filter(Boolean);

        return allowedLocations;
    };
});
