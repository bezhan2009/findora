
'use client';

import { useEffect, useRef } from 'react';
import styles from './chicken-animation.module.css';
import { cn } from '@/lib/utils';

export default function ChickenAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chickenElement = containerRef.current?.querySelector<HTMLDivElement>(`.${styles.chicken}`);
    if (!chickenElement) return;

    let timeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        
        clearTimeout(timeout);
        
        requestAnimationFrame(() => {
          if (chickenElement) {
            chickenElement.style.animation = 'none'; // Disable CSS animation during interaction
            chickenElement.style.transform = `rotateX(65deg) rotateZ(calc(-135deg + ${x}deg)) translateY(${y}px)`;
          }
        });

        timeout = setTimeout(() => {
          if (chickenElement) {
            chickenElement.style.animation = ''; // Restore CSS animation
          }
        }, 200);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(timeout);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={cn(styles.chicken, 'transform-gpu')}>
        {/* head */}
        <div className={cn(styles.cube, styles['chicken__head'])}>
          <div>
            <div className={styles.shadow}></div>
          </div>
          <div className={styles.shadow}></div>
        </div>
        <div className={cn(styles.cube, styles['chicken__beak'])}>
          <div></div>
        </div>
        <div className={cn(styles.cube, styles['chicken__wattle'])}>
          <div></div>
          <div className={styles.shadow}></div>
        </div>
        <div className={cn(styles.cube, styles['chicken__comb'])}>
          <div></div>
        </div>

        {/* body */}
        <div className={cn(styles.cube, styles['chicken__body'])}>
          <div></div>
        </div>
        <div className={cn(styles.cube, styles['chicken__tail'])}>
          <div></div>
        </div>
        <div className={cn(styles.cube, styles['chicken__wing'], styles['chicken__wing-left'])}>
          <div></div>
        </div>
        <div className={cn(styles.cube, styles['chicken__wing'], styles['chicken__wing-right'])}>
          <div></div>
        </div>

        {/* legs */}
        <div className={cn(styles.cube, styles['chicken__knee'], styles['chicken__knee-right'])}>
          <div></div>
        </div>
        <div className={cn(styles.cube, styles['chicken__knee'], styles['chicken__knee-left'])}>
          <div></div>
        </div>
        <div className={cn(styles.cube, styles['chicken__foot'], styles['chicken__foot-right'])}>
          <div></div>
        </div>
        <div className={cn(styles.cube, styles['chicken__foot'], styles['chicken__foot-left'])}>
          <div></div>
        </div>
        <div className={cn(styles.cube, styles['chicken__finger'], styles['chicken__finger-one'])}>
          <div>
            <div className={styles.shadow}></div>
          </div>
        </div>
        <div className={cn(styles.cube, styles['chicken__finger'], styles['chicken__finger-two'])}>
          <div>
            <div className={styles.shadow}></div>
          </div>
        </div>
        <div className={cn(styles.cube, styles['chicken__finger'], styles['chicken__finger-three'])}>
          <div>
            <div className={styles.shadow}></div>
          </div>
        </div>
        <div className={cn(styles.cube, styles['chicken__finger'], styles['chicken__finger-four'])}>
          <div>
            <div className={styles.shadow}></div>
          </div>
        </div>

        {/* shadow */}
        <div className={styles['chicken__shadow']}></div>
      </div>
    </div>
  );
}
