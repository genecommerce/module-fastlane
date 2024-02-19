define(function () {
    'use strict';

    /**
     * Add the data to the window.paypalInsightDataLayer array.
     */
    return function () {
        // TODO: Check that insights is enabled before doing this.
        window.paypalInsightDataLayer = window.paypalInsightDataLayer || [];
        window.paypalInsightDataLayer.push(arguments);
    };
});
