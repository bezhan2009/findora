"use client";

import { useEffect, useState } from 'react';
import GoogleTranslateScript from './google-translate-script';

const GoogleTranslate = () => {
  const [isMounted, setIsMounted] = useState(false);

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
          
          if (!select.parentNode?.querySelector('.custom-arrow')) {
            // Создаем кастомную стрелку
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
            (select.parentNode as HTMLElement).style.position = 'relative';
            select.parentNode?.appendChild(arrow);
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

        // Функция для стилизации выпадающего меню с анимациями
        const styleDropdown = () => {
          const iframe = document.querySelector('.goog-te-menu-frame') as HTMLIFrameElement;
          if (iframe && iframe.style.display !== 'none') {
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
              if (iframeDoc && iframeDoc.readyState === 'complete') {
                
                // Добавляем анимацию появления для всего меню
                const menu = iframeDoc.querySelector('.goog-te-menu2') as HTMLElement | null;
                if (menu) {
                  menu.style.animation = 'slideDown 0.3s ease-out';
                  menu.style.transformOrigin = 'top center';
                }

                // Стилизация элементов меню
                const menuItems = iframeDoc.querySelectorAll('.goog-te-menu2-item');
                menuItems.forEach((item, index) => {
                  const htmlItem = item as HTMLElement;
                  htmlItem.style.padding = '0.75rem 1rem';
                  htmlItem.style.fontSize = '0.875rem';
                  htmlItem.style.transition = 'all 0.2s ease-in-out';
                  htmlItem.style.cursor = 'pointer';
                  htmlItem.style.borderRadius = '6px';
                  htmlItem.style.margin = '3px 0';
                  htmlItem.style.opacity = '0';
                  htmlItem.style.transform = 'translateY(-10px)';
                  
                  // Анимация появления элементов с задержкой
                  setTimeout(() => {
                    htmlItem.style.opacity = '1';
                    htmlItem.style.transform = 'translateY(0)';
                  }, index * 50);

                  // Hover эффекты
                  item.addEventListener('mouseenter', () => {
                    htmlItem.style.backgroundColor = 'hsl(var(--primary) / 0.1)';
                    htmlItem.style.color = 'hsl(var(--primary))';
                    htmlItem.style.transform = 'translateX(4px)';
                  });
                  
                  item.addEventListener('mouseleave', () => {
                    htmlItem.style.backgroundColor = 'transparent';
                    htmlItem.style.color = 'hsl(var(--foreground))';
                    htmlItem.style.transform = 'translateX(0)';
                  });
                });

                // Стилизация активного элемента
                const activeItems = iframeDoc.querySelectorAll('.goog-te-menu2-item-selected');
                activeItems.forEach(item => {
                  const htmlItem = item as HTMLElement;
                  htmlItem.style.backgroundColor = 'hsl(var(--primary))';
                  htmlItem.style.color = 'white';
                  htmlItem.style.fontWeight = '600';
                });

                // Добавляем CSS анимации в iframe
                if (!iframeDoc.head.querySelector('style[data-custom-animations]')) {
                  const style = iframeDoc.createElement('style');
                  style.setAttribute('data-custom-animations', 'true');
                  style.textContent = `
                    @keyframes slideDown {
                      from {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                      }
                    }
                    
                    @keyframes itemSlideIn {
                      from {
                        opacity: 0;
                        transform: translateY(-8px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                    
                    .goog-te-menu2 {
                      animation: slideDown 0.3s ease-out !important;
                      transform-origin: top center;
                    }
                    
                    .goog-te-menu2-item {
                      animation: itemSlideIn 0.3s ease-out forwards;
                    }
                    
                    ::-webkit-scrollbar {
                      width: 8px;
                    }
                    ::-webkit-scrollbar-track {
                      background: hsl(var(--muted));
                      border-radius: 4px;
                      margin: 4px 0;
                    }
                    ::-webkit-scrollbar-thumb {
                      background: hsl(var(--muted-foreground) / 0.5);
                      border-radius: 4px;
                      transition: background 0.2s ease;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                      background: hsl(var(--muted-foreground));
                    }
                    
                    body {
                      background: transparent !important;
                      padding: 0.5rem 0;
                    }
                  `;
                  iframeDoc.head.appendChild(style);
                }
              }
            } catch (error) {
              // Error styling dropdown
            }
          }

          // Стилизация контейнера меню
          if (iframe?.parentElement) {
            iframe.parentElement.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
            iframe.parentElement.style.border = '1px solid hsl(var(--border))';
            iframe.parentElement.style.borderRadius = '12px';
            iframe.parentElement.style.padding = '0.75rem';
            iframe.parentElement.style.backgroundColor = 'hsl(var(--popover))';
            iframe.parentElement.style.animation = 'popIn 0.3s ease-out';
            iframe.parentElement.style.maxHeight = '400px';
            iframe.parentElement.style.overflow = 'hidden';
            iframe.parentElement.style.backdropFilter = 'blur(8px)';
          }
        };

        // Постоянно проверяем и обновляем стили меню
        const dropdownInterval = setInterval(styleDropdown, 100);

        const font = translateDiv.querySelector('font');
        if (font) {
            (font as HTMLElement).style.display = 'none';
        }

        const icon = translateDiv.querySelector('.goog-te-gadget-icon');
        if (icon) {
            (icon as HTMLElement).style.display = 'none';
        }
        
        // Добавляем глобальные стили для анимаций
        if(!document.head.querySelector('style[data-google-translate-animations]')) {
            const styleElement = document.createElement('style');
            styleElement.setAttribute('data-google-translate-animations', 'true');
            styleElement.textContent = `
              @keyframes popIn {
                from {
                  opacity: 0;
                  transform: translateY(-8px) scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
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

    const intervalId = setInterval(styleWidget, 200);

    return () => {
      clearInterval(intervalId);
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
        </div>
      )}
    </>
  );
};

export default GoogleTranslate;
