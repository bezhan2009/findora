
"use client";

import React from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1508923567004-3a6b8004f3d3"
        alt="Mountain landscape"
        layout="fill"
        objectFit="cover"
        className="z-0"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content */}
      <main className="relative z-20 w-full max-w-md md:max-w-2xl px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-14 pr-4 py-3 text-lg h-16 rounded-full shadow-lg"
          />
        </div>
      </main>
    </div>
  );
}
