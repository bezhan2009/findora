
"use client";

import { useEffect } from 'react';
import Script from 'next/script';
import { Globe } from 'lucide-react';

const GoogleTranslate = () => {
  useEffect(() => {
    // This is to forcefully restyle the widget to fit the navbar
    const interval = setInterval(() => {
      const translateDiv = document.getElementById('google_translate_element');
      if (translateDiv) {
        const select = translateDiv.querySelector('select');
        if (select) {
            select.style.border = 'none';
            select.style.padding = '0';
            select.style.margin = '0';
            select.style.fontWeight = '500';
            select.style.position = 'relative';
            select.style.top = '-1px';
            select.style.cursor = 'pointer';
        }
        
        const iframe = document.querySelector('.goog-te-menu-frame');
        if (iframe?.parentElement) {
            iframe.parentElement.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
            iframe.parentElement.style.border = '1px solid hsl(var(--border))';
            iframe.parentElement.style.borderRadius = 'var(--radius)';
            iframe.parentElement.style.padding = '0.25rem';
            iframe.parentElement.style.backgroundColor = 'hsl(var(--popover))';
        }

        const font = translateDiv.querySelector('font');
        if (font) {
            font.style.color = 'hsl(var(--foreground))';
        }

        const icon = translateDiv.querySelector('.goog-te-gadget-icon');
        if (icon) {
            icon.style.display = 'none';
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
      <div id="google_translate_element" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
          <Globe className="h-5 w-5 mr-1" />
      </div>
    </>
  );
};

export default GoogleTranslate;
