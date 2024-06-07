define(['uiRegistry'], function (uiRegistry) {
    'use strict';

    return function () {
        const countries = uiRegistry.get('checkoutProvider').get('dictionaries.country_id'),
            allowedLocations = countries.map(({ value }) => value).filter(Boolean);

        return allowedLocations;
    };
});
