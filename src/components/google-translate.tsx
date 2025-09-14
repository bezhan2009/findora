"use client";

import { useEffect, useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import GoogleTranslateScript from './google-translate-script';

const GoogleTranslate = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const styleWidget = () => {
      const translateDiv = document.getElementById('google_translate_element');
      if (translateDiv) {
        const select = translateDiv.querySelector('select');
        if (select) {
          // Стилизация основного селекта
          select.style.border = '1px solid hsl(var(--border))';
          select.style.padding = '0.5rem 2.5rem 0.5rem 0.75rem';
          select.style.borderRadius = '6px';
          select.style.margin = '0';
          select.style.fontWeight = '500';
          select.style.fontSize = '0.875rem';
          select.style.position = 'relative';
          select.style.top = '0px';
          select.style.cursor = 'pointer';
          select.style.backgroundColor = 'hsl(var(--background))';
          select.style.color = 'hsl(var(--foreground))';
          select.style.transition = 'all 0.2s ease-in-out';
          select.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
          select.style.minWidth = '120px';
          select.style.appearance = 'none';
          select.style.backgroundImage = 'none';
          
          // Создаем кастомную стрелку
          const parentNode = select.parentNode as HTMLElement;
          if (parentNode && !parentNode.querySelector('.custom-arrow')) {
            const arrow = document.createElement('div');
            arrow.className = 'custom-arrow';
            arrow.innerHTML = `
              <div style="
                position: absolute;
                right: 0.75rem;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: none;
                transition: transform 0.2s ease-in-out;
              ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            `;
            parentNode.style.position = 'relative';
            parentNode.appendChild(arrow);
          }


          // Hover эффекты
          select.addEventListener('mouseenter', () => {
            select.style.borderColor = 'hsl(var(--primary))';
            select.style.boxShadow = '0 0 0 3px hsl(var(--primary) / 0.1)';
          });

          select.addEventListener('mouseleave', () => {
            select.style.borderColor = 'hsl(var(--border))';
            select.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
          });

          select.addEventListener('focus', () => {
            select.style.borderColor = 'hsl(var(--primary))';
            select.style.boxShadow = '0 0 0 3px hsl(var(--primary) / 0.1)';
            select.style.outline = 'none';
          });

          select.addEventListener('blur', () => {
            select.style.borderColor = 'hsl(var(--border))';
            select.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
          });

          select.addEventListener('change', () => {
            // Анимация при изменении языка
            select.style.transform = 'scale(0.98)';
            setTimeout(() => {
              select.style.transform = 'scale(1)';
            }, 150);
          });
        }
        
        // Стилизация выпадающего меню
        const styleDropdown = () => {
          const iframe = document.querySelector('.goog-te-menu-frame') as HTMLIFrameElement;
          if (iframe) {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
              // Стилизация элементов меню
              const menuItems = iframeDoc.querySelectorAll('.goog-te-menu2-item');
              menuItems.forEach(item => {
                const htmlItem = item as HTMLElement;
                htmlItem.style.padding = '0.5rem 1rem';
                htmlItem.style.fontSize = '0.875rem';
                htmlItem.style.transition = 'all 0.15s ease-in-out';
                htmlItem.style.cursor = 'pointer';
                htmlItem.style.borderRadius = '4px';
                htmlItem.style.margin = '2px 0';
                
                // Hover эффекты
                item.addEventListener('mouseenter', () => {
                  htmlItem.style.backgroundColor = 'hsl(var(--primary) / 0.1)';
                  htmlItem.style.color = 'hsl(var(--primary))';
                });
                
                item.addEventListener('mouseleave', () => {
                  htmlItem.style.backgroundColor = 'transparent';
                  htmlItem.style.color = 'hsl(var(--foreground))';
                });
              });

              // Стилизация активного элемента
              const activeItems = iframeDoc.querySelectorAll('.goog-te-menu2-item-selected');
              activeItems.forEach(item => {
                (item as HTMLElement).style.backgroundColor = 'hsl(var(--primary))';
                (item as HTMLElement).style.color = 'white';
              });

              // Стилизация скроллбара
              if (!iframeDoc.querySelector('.custom-scrollbar-styles')) {
                const style = iframeDoc.createElement('style');
                style.className = 'custom-scrollbar-styles';
                style.textContent = `
                  ::-webkit-scrollbar {
                    width: 6px;
                  }
                  ::-webkit-scrollbar-track {
                    background: hsl(var(--muted));
                    border-radius: 3px;
                  }
                  ::-webkit-scrollbar-thumb {
                    background: hsl(var(--muted-foreground) / 0.5);
                    border-radius: 3px;
                  }
                  ::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--muted-foreground));
                  }
                `;
                iframeDoc.head.appendChild(style);
              }
            }
          }

          if (iframe?.parentElement) {
            iframe.parentElement.style.boxShadow = '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
            iframe.parentElement.style.border = '1px solid hsl(var(--border))';
            iframe.parentElement.style.borderRadius = '8px';
            iframe.parentElement.style.padding = '0.5rem';
            iframe.parentElement.style.backgroundColor = 'hsl(var(--popover))';
            iframe.parentElement.style.animation = 'slideIn 0.2s ease-out';
            iframe.parentElement.style.maxHeight = '300px';
            iframe.parentElement.style.overflow = 'hidden';
          }
        };

        // Периодически проверяем и стилизуем выпадающее меню
        const dropdownInterval = setInterval(styleDropdown, 100);

        const font = translateDiv.querySelector('font');
        if (font) {
            font.style.display = 'none'; // Скрываем стандартный текст
        }

        const icon = translateDiv.querySelector('.goog-te-gadget-icon');
        if (icon) {
            (icon as HTMLElement).style.display = 'none';
        }

        // Добавляем кастомные стили для анимаций
        if (!document.querySelector('[data-custom-animations]')) {
          const styleElement = document.createElement('style');
          styleElement.setAttribute('data-custom-animations', 'true');
          styleElement.textContent = `
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(-8px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.02); }
              100% { transform: scale(1); }
            }
            
            .google-translate-select {
              transition: all 0.2s ease-in-out;
            }
            
            .google-translate-select:hover {
              border-color: hsl(var(--primary)) !important;
            }
          `;
          document.head.appendChild(styleElement);
        }

        return () => {
          clearInterval(dropdownInterval);
        };
      }
      return undefined;
    };

    const interval = setInterval(styleWidget, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <GoogleTranslateScript />
      {isMounted && (
        <div className="relative group">
          <div 
            id="google_translate_element" 
            className="flex items-center text-sm font-medium text-foreground transition-all duration-200 hover:text-primary cursor-pointer"
          />
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute -inset-2 bg-primary/10 rounded-lg blur-sm" />
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleTranslate;
