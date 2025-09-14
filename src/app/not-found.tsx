"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ChickenAnimation from '@/components/chicken-animation';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-gradient-to-br from-orange-50 to-pink-100 dark:from-gray-900 dark:to-slate-800 text-center p-4">
      <div className="mb-8">
        <ChickenAnimation />
      </div>
      <h1 className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-headline animate-pulse">404</h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Oops! The page you're looking for must have flown the coop!
      </p>
      <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700">
        <Link href="/">
          Return to Home
        </Link>
      </Button>
    </div>
  );
}
