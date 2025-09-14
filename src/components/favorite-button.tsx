
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

    const handleAnimate = () => {
      // Simple pulse animation
      gsap.to(heartSvg, {
        scale: 1.2,
        duration: 0.2,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
      });
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
        
        // Trigger animation
        if (svgRef.current) {
          const event = new CustomEvent('animateHeart');
          svgRef.current.dispatchEvent(event);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  const svgContent = (
    <svg
      ref={svgRef}
      className={cn('heart transition-all duration-300', as === 'button' ? 'h-5 w-5 mr-2' : 'h-5 w-5 mx-auto')}
      viewBox="0 0 40 40"
    >
      <path
        stroke="currentColor"
        strokeWidth="2"
        fill={favorited ? "currentColor" : "none"}
        d="M20 35.04c-4.16 0-16-10.752-16-20.928C4 9.248 8.032 4.96 12.576 4.96c3.648 0 6.144 2.56 7.424 4.352 1.28-1.856 3.776-4.352 7.424-4.352C31.968 4.96 36 9.248 36 14.112c0 10.176-11.84 20.864-16 20.928z"
      />
    </svg>
  );

  if (as === 'icon') {
    return (
      <button
        onClick={handleFavoriteToggle}
        disabled={isAnimating}
        className={cn(
          "relative h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300",
          "hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          favorited ? "text-rose-500" : "text-gray-400 hover:text-rose-400",
          className
        )}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      >
        {svgContent}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>
    );
  }

  return (
    <Button
      onClick={handleFavoriteToggle}
      disabled={isAnimating}
      variant={favorited ? 'default' : 'outline'}
      size="lg"
      className={cn(
        "transition-all duration-300",
        favorited && "bg-rose-500 hover:bg-rose-600 text-white",
        className
      )}
    >
      {svgContent}
      {isAnimating ? '...' : (favorited ? 'Favorited' : 'Add to Favorites')}
    </Button>
  );
}
