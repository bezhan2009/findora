
"use client";

import Script from 'next/script';

export default function GoogleTranslateScript() {
    return (
        <>
            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />
            <Script id="google-translate-init" strategy="afterInteractive">
                {`
                function googleTranslateElementInit() {
                    new google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,ru,tg',
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                    }, 'google_translate_element');
                }
                `}
            </Script>
        </>
    )
}
