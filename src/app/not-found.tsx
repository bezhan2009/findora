"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ChickenAnimation from '@/components/chicken-animation';
import { Play } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-gradient-to-br from-orange-50 to-pink-100 dark:from-gray-900 dark:to-slate-800 text-center p-4">
      <div className="mb-8">
        <ChickenAnimation />
      </div>
      <h1 className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-headline animate-pulse" style={{ zIndex: 10 }}>
        404
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md" style={{ zIndex: 10 }}>
        Ой! Страница, которую вы ищете, должно быть, улетела!
      </p>
      <div className="flex gap-4" style={{ zIndex: 10 }}>
        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          <Link href="/">
            Вернуться на главную
          </Link>
        </Button>
        <Button
          asChild
          variant="secondary"
        >
          <a href="http://212.67.9.175" target="_blank" rel="noopener noreferrer">
            <Play className="mr-2 h-4 w-4" />
            Играть
          </a>
        </Button>
      </div>
    </div>
  );
}
