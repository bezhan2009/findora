
'use client';

import { useState, useEffect, useRef } from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import type { Service } from '@/lib/types';
import { Button } from './ui/button';

interface FavoriteButtonProps {
  service: Service;
  className?: string;
  as?: 'button' | 'icon';
}

export function FavoriteButton({ service, className, as = 'icon' }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const favorited = isFavorite(service.id);

  useEffect(() => {
    const heartSvg = svgRef.current;
    if (!heartSvg) return;

    gsap.set('.heart__fragment', {
        opacity: 0,
    });
    gsap.set(['.heart__beat', '.heart__fragments'], {
        transformOrigin: '50% 50%',
    });
     gsap.set('.heart__fill', {
        transformOrigin: '50% 100%',
    });


    const handleAnimate = () => {
      const STARTERS = heartSvg.querySelectorAll('.heart__segment--start');
      const MIDS = [...heartSvg.querySelectorAll('.heart__segment--middle')].reverse();
      const ENDERS = [...heartSvg.querySelectorAll('.heart__segment--end')].reverse();
      const SEGMENTS = [...STARTERS, ...MIDS, ...ENDERS];
      const FRAGMENTS = heartSvg.querySelectorAll('.heart__fragment');

      const timeline = gsap.timeline({
        onStart: () => {
          gsap.set([SEGMENTS, '.heart__fragments'], { display: 'block' });
          gsap.set('.heart__stroke', { display: 'none' });
          gsap.set('.heart__fill', { scaleY: 0, display: 'none' });
          gsap.set(FRAGMENTS, {
            opacity: 0,
            '--hue': () => gsap.utils.random(0, 359),
          });
        },
        onComplete: () => {
          gsap.set([SEGMENTS, '.heart__fragments'], { display: 'none' });
          gsap.set('.heart__stroke', { display: 'block' });
        },
      });

      timeline
        .set('.heart__beat', { '--hue': 180 })
        .set('.heart__segment--start', { opacity: 1 })
        .to([MIDS, ENDERS], {
          stagger: 0.005,
          opacity: 1,
          duration: 0.05,
        })
        .to('.heart__beat', {
          duration: 0.5,
          '--hue': 360,
          ease: 'power1.in',
        }, 0)
        .to(STARTERS, {
          stagger: 0.025,
          opacity: 0,
          duration: 0.05,
        }, 0.2)
        .to('.heart__beat', {
          scale: 1.5,
          duration: 0.25,
        }, '>-0.15')
        .to('.heart__beat', {
          scale: 1,
          duration: 0.35,
          ease: 'back.out(5)',
        })
        .to('.heart__fill', {
          display: 'block',
          scaleY: 1,
          duration: 0.2,
        }, '>-0.25')
        .to(SEGMENTS, { opacity: 0, duration: 0.1 }, '>-0.25')
        .to(FRAGMENTS, {
          opacity: 1,
          ease: 'power4.in',
          duration: 0.2,
        }, '>-0.725')
        .to(FRAGMENTS, {
            opacity: 0,
            duration: 0.4
        })
        .timeScale(1.15);
    };

    heartSvg.addEventListener('animateHeart', handleAnimate);

    return () => {
      heartSvg.removeEventListener('animateHeart', handleAnimate);
    };
  }, [svgRef]);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAnimating) return;

    setIsAnimating(true);

    try {
      if (favorited) {
        removeFavorite(service.id);
      } else {
        addFavorite(service.id);
        if (svgRef.current) {
            svgRef.current.dispatchEvent(new CustomEvent('animateHeart'));
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };
  
  if (as === 'button') {
    return (
        <Button size="lg" variant="outline" onClick={handleFavoriteToggle}>
            <svg
                ref={svgRef}
                className={cn('heart h-6 w-6 mr-2', favorited && 'text-rose-500')}
                viewBox="0 0 40 40"
                fill="currentColor"
            >
                 <path className="heart__stroke" d="M20 35.04c-4.16 0-16-10.752-16-20.928C4 9.248 8.032 4.96 12.576 4.96c3.648 0 6.144 2.56 7.424 4.352 1.28-1.856 3.776-4.352 7.424-4.352C31.968 4.96 36 9.248 36 14.112c0 10.176-11.84 20.864-16 20.928zM12.576 7.328c-3.264 0-6.208 3.2-6.208 6.784 0 9.152 11.2 18.496 13.632 18.56 2.432-.064 13.632-9.408 13.632-18.56 0-3.584-2.944-6.784-6.208-6.784-4.032 0-6.272 4.672-6.336 4.736-.32.896-1.792.896-2.176 0 0 0-2.304-4.736-6.336-4.736z"/>
                <path className="heart__fill" d="M20 35.052c-4.148-.119-16-10.785-16-20.919 0-4.918 4.03-9.185 8.593-9.185 3.674 0 6.103 2.548 7.407 4.385 1.304-1.837 3.733-4.385 7.407-4.385C31.97 4.948 36 9.215 36 14.133c0 10.074-11.852 20.8-16 20.919z"/>
            </svg>
            {favorited ? 'Saved to Favorites' : 'Save to Favorites'}
        </Button>
    )
  }

  return (
    <button
      onClick={handleFavoriteToggle}
      disabled={isAnimating}
      className={cn(
        "relative h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300",
        "bg-card/60 hover:bg-card text-rose-500 backdrop-blur-sm",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        favorited ? "text-rose-500" : "text-white",
        className
      )}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        ref={svgRef}
        className={cn('heart h-5 w-5 transition-all duration-300', favorited && 'fill-current')}
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <g className="heart__fragments" style={{display: 'none'}}>
          {[...Array(40)].map((_, i) => (
            <circle key={i} cx="20" cy="20" r="2" className="heart__fragment" />
          ))}
        </g>
        <g className="heart__beat" style={{'--hue': 0, display: 'none'}}>
            <path d="M10.682 36.832a2.453 2.453 0 001.595-3.128 2.453 2.453 0 00-3.067-1.656 2.453 2.453 0 00-1.656 3.066 2.453 2.453 0 003.067 1.718z" className="heart__segment heart__segment--start"/>
            <path d="M7.418 35.88a2.3 2.3 0 002.328-2.328 2.3 2.3 0 00-2.328-2.328 2.3 2.3 0 00-2.328 2.328 2.3 2.3 0 002.328 2.328z" className="heart__segment heart__segment--start" style={{'--lightness': 65}}/>
            <path d="M6.027 32.223a2.32 2.32 0 002.042-1.034 2.32 2.32 0 00-1.034-2.042 2.32 2.32 0 00-2.042 1.034 2.32 2.32 0 001.034 2.042z" className="heart__segment heart__segment--middle" style={{'--lightness': 65}}/>
            <path d="M4.14 26.965a2.224 2.224 0 100-4.448 2.224 2.224 0 000 4.448z" className="heart__segment heart__segment--middle" style={{'--lightness': 65}}/>
            <path d="M3.77 21.03c-1.12 0-2.028.908-2.028 2.028s.908 2.028 2.028 2.028 2.028-.908 2.028-2.028-.908-2.028-2.028-2.028z" className="heart__segment heart__segment--middle"/>
            <path d="M4.385 16.63a1.595 1.595 0 100-3.19 1.595 1.595 0 000 3.19z" className="heart__segment heart__segment--middle"/>
            <path d="M6.16 12.336a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" className="heart__segment heart__segment--middle" style={{'--lightness': 65}}/>
            <path d="M8.567 9.17a.9.9 0 100-1.8.9.9 0 000 1.8z" className="heart__segment heart__segment--middle" style={{'--lightness': 35}}/>
            <path d="M12.062 6.84a.83.83 0 100-1.66.83.83 0 000 1.66z" className="heart__segment heart__segment--middle"/>
            <path d="M16.14 5.38a.6.6 0 100-1.2.6.6 0 000 1.2z" className="heart__segment heart__segment--middle" style={{'--lightness': 35}}/>
            <path d="M20 4.96a.545.545 0 100-1.09.545.545 0 000 1.09z" className="heart__segment heart__segment--end" style={{'--lightness': 65}}/>
            <path d="M23.86 5.38a.6.6 0 100-1.2.6.6 0 000 1.2z" className="heart__segment heart__segment--end" style={{'--lightness': 35}}/>
            <path d="M27.938 6.84a.83.83 0 100-1.66.83.83 0 000 1.66z" className="heart__segment heart__segment--end"/>
            <path d="M31.433 9.17a.9.9 0 100-1.8.9.9 0 000 1.8z" className="heart__segment heart__segment--end" style={{'--lightness': 35}}/>
            <path d="M33.84 12.336a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" className="heart__segment heart__segment--end" style={{'--lightness': 65}}/>
            <path d="M35.615 16.63a1.595 1.595 0 100-3.19 1.595 1.595 0 000 3.19z" className="heart__segment heart__segment--end"/>
            <path d="M36.23 21.03c1.12 0 2.028.908 2.028 2.028s-.908 2.028-2.028 2.028-2.028-.908-2.028-2.028.908-2.028 2.028-2.028z" className="heart__segment heart__segment--end"/>
            <path d="M35.86 26.965a2.224 2.224 0 100-4.448 2.224 2.224 0 000 4.448z" className="heart__segment heart__segment--end" style={{'--lightness': 65}}/>
            <path d="M33.973 32.223a2.32 2.32 0 00-1.034 2.042 2.32 2.32 0 002.042 1.034 2.32 2.32 0 001.034-2.042 2.32 2.32 0 00-2.042-1.034z" className="heart__segment heart__segment--end" style={{'--lightness': 65}}/>
            <path d="M32.582 35.88a2.3 2.3 0 00-2.328-2.328 2.3 2.3 0 00-2.328 2.328 2.3 2.3 0 002.328 2.328 2.3 2.3 0 002.328-2.328z" className="heart__segment heart__segment--end" style={{'--lightness': 65}}/>
            <path d="M29.318 36.832a2.453 2.453 0 003.067-1.718 2.453 2.453 0 00-1.656-3.066 2.453 2.453 0 00-3.067 1.656 2.453 2.453 0 001.656 3.128z" className="heart__segment heart__segment--end"/>
        </g>
        <path className="heart__stroke" d="M20 35.04c-4.16 0-16-10.752-16-20.928C4 9.248 8.032 4.96 12.576 4.96c3.648 0 6.144 2.56 7.424 4.352 1.28-1.856 3.776-4.352 7.424-4.352C31.968 4.96 36 9.248 36 14.112c0 10.176-11.84 20.864-16 20.928zM12.576 7.328c-3.264 0-6.208 3.2-6.208 6.784 0 9.152 11.2 18.496 13.632 18.56 2.432-.064 13.632-9.408 13.632-18.56 0-3.584-2.944-6.784-6.208-6.784-4.032 0-6.272 4.672-6.336 4.736-.32.896-1.792.896-2.176 0 0 0-2.304-4.736-6.336-4.736z"/>
        <path className="heart__fill" fill="currentColor" d="M20 35.052c-4.148-.119-16-10.785-16-20.919 0-4.918 4.03-9.185 8.593-9.185 3.674 0 6.103 2.548 7.407 4.385 1.304-1.837 3.733-4.385 7.407-4.385C31.97 4.948 36 9.215 36 14.133c0 10.074-11.852 20.8-16 20.919z"/>
      </svg>
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}
