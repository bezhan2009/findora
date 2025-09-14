"use client";

import Script from 'next/script';
import { useEffect } from 'react';

export default function GoogleTranslateScript() {
  useEffect(() => {
    // Глобальная функция для инициализации
    (window as any).googleTranslateElementInit = function() {
      if (window.google && window.google.translate) {
        new (window.google.translate.TranslateElement)({
          pageLanguage: 'en',
          includedLanguages: 'en,ru,tg',
          layout: (window.google.translate.TranslateElement as any).InlineLayout.SIMPLE,
          autoDisplay: false,
          floatPosition: 0,
          multilanguagePage: true
        }, 'google_translate_element');
      }
    };
  }, []);

  return (
    <>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&hl=en"
        strategy="afterInteractive"
        onLoad={() => {
          // Принудительная перезагрузка виджета после загрузки
          if (window.google && window.google.translate && (window.google.translate.TranslateElement as any)) {
            (window.google.translate.TranslateElement as any).InlineLayout.SIMPLE;
          }
        }}
      />
    </>
  );
}
