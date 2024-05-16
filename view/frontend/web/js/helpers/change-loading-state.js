define(['jquery'], function ($) {
    'use strict';

    // Little helper to show/hide the loading state.
    return function (show) {
        const process = show ? 'processStart' : 'processStop';

        $(document.body).trigger(process).toggleClass('_has-modal', show);
    };
});
