require(['jquery'], function ($) {
    'use strict';

    $('#fastlane-learn-more').on('click', (event) => {
        event.preventDefault();

        // Open the relevant sections.
        $('.braintree-section .button.action-configure:not(.open)').trigger('click');
        $('.fastlane-section:not(.active) a[id$="braintree_paypal_fastlane-head"]').trigger('click');

        // Scroll to the Fastlane section.
        const fastlaneSection = $('.fastlane-section').get(0);

        if (fastlaneSection) {
            fastlaneSection.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    });
});
