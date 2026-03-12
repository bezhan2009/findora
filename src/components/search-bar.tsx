
"use client";

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { smartSearchSuggestions } from '@/ai/flows/smart-search-assistant';


export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // Увеличиваем задержку до 1500мс для максимальной экономии квот Gemini Free Tier
  const debouncedQuery = useDebounce(query, 1500);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Шлем запрос только если введено более 3 символов
    if (debouncedQuery && debouncedQuery.trim().length > 3) {
      setLoading(true);
      smartSearchSuggestions({ query: debouncedQuery.trim() })
        .then(response => {
            if (response && response.suggestions) {
                setSuggestions(response.suggestions);
                setIsOpen(response.suggestions.length > 0);
            }
        })
        .catch(err => {
            // При ошибке квот (429) просто молча скрываем подсказки, не мешая пользователю
            console.warn("Search suggestions rate limited:", err.message);
            setSuggestions([]);
            setIsOpen(false);
        })
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
    router.push(`/?q=${encodeURIComponent(suggestion)}`);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/?q=${encodeURIComponent(query)}`);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <form onSubmit={handleSubmit}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
            type="search"
            placeholder="Поиск товаров и услуг..."
            className="w-full pl-10 pr-4 py-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 3 && suggestions.length > 0 && setIsOpen(true)}
        />
      </form>
      {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-card border rounded-md shadow-lg z-[100]">
          <ul className="py-1">
            {suggestions.map((item, index) => (
              <li 
                key={index} 
                onMouseDown={() => handleSelect(item)}
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm transition-colors"
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
