define(function () {
    'use strict';

    /**
     * Formats the styles from config into what Fastlane is expecting.
     */
    return function () {
        const {
            inputBackgroundColor,
            inputBorderColor,
            inputBorderRadius,
            inputBorderWidth,
            inputFocusBorderColor,
            inputTextColor,
            rootBackgroundColor,
            rootErrorColor,
            rootFontFamily,
            rootFontSize,
            rootTextColor,
            rootPadding,
            rootPrimaryColor
        } = window.checkoutConfig?.fastlane?.styling || {};

        return {
            root: {
                backgroundColor: rootBackgroundColor,
                errorColor: rootErrorColor,
                fontFamily: rootFontFamily,
                textColorBase: rootTextColor,
                fontSizeBase: rootFontSize,
                padding: rootPadding,
                primaryColor: rootPrimaryColor
            },
            input: {
                backgroundColor: inputBackgroundColor,
                borderRadius: inputBorderRadius,
                borderColor: inputBorderColor,
                borderWidth: inputBorderWidth,
                focusBorderColor: inputFocusBorderColor,
                textColorBase: inputTextColor
            }
        };
    };
});
