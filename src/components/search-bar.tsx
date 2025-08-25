
"use client";

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { smartSearchSuggestions } from '@/ai/flows/smart-search-assistant';
import { useDebounce } from '@/hooks/use-debounce';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      smartSearchSuggestions({ query: debouncedQuery })
        .then(response => {
            if (response && response.suggestions) {
                setSuggestions(response.suggestions);
                setIsOpen(true);
            }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);
  
  const handleSelect = (suggestion: string) => {
      setQuery(suggestion);
      setSuggestions([]);
      setIsOpen(false);
  }

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
         {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />}
         {isOpen && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-card border rounded-md shadow-lg z-10">
                <ul>
                    {suggestions.map((item, index) => (
                        <li 
                            key={index} 
                            onClick={() => handleSelect(item)}
                            className="px-4 py-2 hover:bg-accent cursor-pointer"
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
}
