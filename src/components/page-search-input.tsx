
"use client";

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

export default function PageSearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
        router.push(`/`);
        return;
    };
    router.push(`/?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for services like 'logo design' or 'website development'..."
        className="w-full h-14 pl-12 pr-4 text-base rounded-full shadow-lg text-foreground"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
