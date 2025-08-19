
"use client";

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from './ui/input';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
            type="search"
            placeholder="Search for services..."
            className="w-full pl-10 pr-4 py-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    </div>
  );
}
