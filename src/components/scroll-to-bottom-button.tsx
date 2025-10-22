
'use client';

import React, { useEffect, useRef } from 'react';

const ScrollToBottomButton = ({ chatRef, className = '', showThreshold = 100 }: { chatRef: React.RefObject<HTMLDivElement>, className?: string, showThreshold?: number }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Функция проверки, в конце ли чат (с порогом)
  const isAtBottom = () => {
    if (!chatRef?.current) return true;
    const { scrollTop, clientHeight, scrollHeight } = chatRef.current;
    return scrollTop + clientHeight >= scrollHeight - showThreshold;
  };

  // Показ/скрытие кнопки
  const toggleButton = () => {
    if (buttonRef.current) {
      if (isAtBottom()) {
        buttonRef.current.classList.remove('show');
      } else {
        buttonRef.current.classList.add('show');
      }
    }
  };

  // Скролл в конец
  const scrollToBottom = () => {
    if (chatRef?.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth',
      });
      // Обновляем состояние после скролла
      setTimeout(toggleButton, 300);
    }
  };

  // Throttle для скролла (проверка не чаще 100ms)
  useEffect(() => {
    const currentChatRef = chatRef?.current;
    if (!currentChatRef) return;

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(toggleButton, 100);
    };

    currentChatRef.addEventListener('scroll', handleScroll);
    return () => {
      currentChatRef.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [chatRef]);

  // Инициализация
  useEffect(() => {
    toggleButton();
  }, [chatRef]);

  return (
    <button
      ref={buttonRef}
      className={`scroll-to-bottom ${className}`}
      onClick={scrollToBottom}
      title="Перейти в конец чата"
      aria-label="Скролл в конец чата"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42z" />
      </svg>
    </button>
  );
};

export default ScrollToBottomButton;
