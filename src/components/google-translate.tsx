
"use client";

import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import GoogleTranslateScript from './google-translate-script';

const GoogleTranslate = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // This is to forcefully restyle the widget to fit the navbar
    const interval = setInterval(() => {
      const translateDiv = document.getElementById('google_translate_element');
      if (translateDiv) {
        const select = translateDiv.querySelector('select');
        if (select) {
            select.style.border = 'none';
            select.style.padding = '0.5rem';
            select.style.margin = '0';
            select.style.fontWeight = '500';
            select.style.position = 'relative';
            select.style.top = '-1px';
            select.style.cursor = 'pointer';
            select.style.backgroundColor = 'transparent';
            select.style.color = 'hsl(var(--foreground))';
            select.classList.add('hover:text-primary');
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
      <GoogleTranslateScript />
      {isMounted && (
        <div id="google_translate_element" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
            <Globe className="h-5 w-5 mr-1" />
        </div>
      )}
    </>
  );
};

export default GoogleTranslate;
