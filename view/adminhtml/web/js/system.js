require(['jquery', 'domReady!'], function ($) {
    'use strict';

    const  attachAnchorLinks = () => {
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
        },

        addPlaceholders = () => {
            /* eslint-disable max-len */
            const placeholderFields = {
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_root_background_color': '#FFFFFF',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_root_error_color': '#D9360B',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_root_font_family': 'Paypal-Open, sans-serif',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_root_font_size': '16px',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_root_padding': '4px',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_root_primary_color': '#0057FF',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_root_text_color': '#010B0D',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_input_background_color': '#FFFFFF',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_input_border_color': '#DADDDD',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_input_border_radius': '4px',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_input_border_width': '1px',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_input_focus_border_color': '#0057FF',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_input_text_color': '#010B0D'
            };
            /* eslint-enable max-len */

            Object.keys(placeholderFields).forEach((id) => {
                $(id).attr('placeholder',  placeholderFields[id]);
            });
        },

        addColorInputs = () => {
            /* eslint-disable max-len */
            const colorFields = [
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_root_background_color',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_root_error_color',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_root_primary_color',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_root_text_color',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_input_background_color',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_input_border_color',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_input_focus_border_color',
                '#payment_us_braintree_section_braintree_paypal_fastlane_braintree_fastlane_styling_braintree_fastlane_styling_input_text_color'
            ];
            /* eslint-enable max-len */

            $(colorFields).each((index, colorField) => {
                const $colorPicker = $('<input type="color" />'),
                    $colorField = $(colorField),
                    placeholderValue =  $colorField.attr('placeholder');

                $colorField.on('change', (event) => $colorPicker.val(event.target.value || placeholderValue));
                $colorPicker.on('input', (event) => $colorField.val(event.target.value));

                $colorPicker.val($colorField.val() || placeholderValue);
                $colorPicker.insertAfter(colorField);
            });
        };

    attachAnchorLinks();
    addPlaceholders();
    addColorInputs();
});

