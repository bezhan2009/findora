'use client';

import { useEffect, useRef } from 'react';
import styles from './chicken-animation.module.css';
import { cn } from '@/lib/utils';

export default function ChickenAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame;
    let startTime;
    let isMouseOver = false;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;

      if (containerRef.current && !isMouseOver) {
        const chickenElement = containerRef.current.querySelector(`.${styles.chicken}`);
        if (chickenElement) {
          // Subtle bobbing animation
          const bob = Math.sin(elapsed * 2) * 4; // Slower and smaller bob
          (chickenElement as HTMLElement).style.transform = `rotateX(65deg) rotateZ(45deg) translateY(${bob}px)`;
        }
      }
      animationFrame = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        if (!isMouseOver) return;

        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

        cancelAnimationFrame(animationFrame);
        requestAnimationFrame(() => {
          if (containerRef.current) {
            const chickenElement = containerRef.current.querySelector(`.${styles.chicken}`);
            if (chickenElement) {
              (chickenElement as HTMLElement).style.transform = `rotateX(65deg) rotateZ(calc(45deg + ${x}deg)) translateY(${y}px)`;
            }
          }
        });
    };
    
    const handleMouseEnter = () => {
        isMouseOver = true;
    }

    const handleMouseLeave = () => {
        isMouseOver = false;
        startTime = null; // Reset start time for bobbing animation
        if(!animationFrame) {
            animationFrame = requestAnimationFrame(animate);
        }
    }


    animationFrame = requestAnimationFrame(animate);
    const currentContainer = containerRef.current;
    if (currentContainer) {
        currentContainer.addEventListener('mousemove', handleMouseMove);
        currentContainer.addEventListener('mouseenter', handleMouseEnter);
        currentContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('mousemove', handleMouseMove);
        currentContainer.removeEventListener('mouseenter', handleMouseEnter);
        currentContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrame);
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

        {/* light source */}
        <div className={styles.lightsource}>
          <div className={styles['lightsource-0']}>
            <div className={styles['lightsource-1']}>
              <div className={styles['lightsource-1-1']}>
                <div className={styles['lightsource-1-1-1']}>
                  <div className={styles['lightsource-1-1-1-1']}></div>
                </div>
              </div>
            </div>
            <div className={styles['lightsource-2']}>
              <div className={styles['lightsource-2-1']}>
                <div className={styles['lightsource-2-1-1']}>
                  <div className={styles['lightsource-2-1-1-1']}>
                    <div className={styles['lightsource-2-1-1-1-1']}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles['lightsource-3']}>
              <div className={styles['lightsource-3-1']}>
                <div className={styles['lightsource-3-1-1']}></div>
              </div>
              <div className={styles['lightsource-3-2']}>
                <div className={styles['lightsource-3-2-1']}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
