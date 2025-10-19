"use client";

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SmartSearchSuggestionsInputSchema = z.object({
  query: z.string().describe('The current search query.'),
});

const SmartSearchSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of search suggestions.'),
});

const smartSearchSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartSearchSuggestionsFlow',
    inputSchema: SmartSearchSuggestionsInputSchema,
    outputSchema: SmartSearchSuggestionsOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'smartSearchSuggestionsPrompt',
      input: { schema: SmartSearchSuggestionsInputSchema },
      output: { schema: SmartSearchSuggestionsOutputSchema },
      prompt: `You are a search assistant that provides search suggestions based on the user's current query.

Current query: {{{query}}}

Provide a list of search suggestions that are relevant to the query. Return as a JSON array of strings.
Ensure the output is a valid JSON array.`,
    });
    const { output } = await prompt(input);
    return output!;
  }
);


export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      smartSearchSuggestionsFlow({ query: debouncedQuery })
        .then(response => {
            if (response && response.suggestions) {
                setSuggestions(response.suggestions);
                if (response.suggestions.length > 0) {
                    setIsOpen(true);
                } else {
                    setIsOpen(false);
                }
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
            placeholder="Поиск услуг..."
            className="w-full pl-10 pr-4 py-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && suggestions.length > 0 && setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 100)} // Added onBlur with a slight delay
        />
      </form>
      {loading && !isOpen && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-card border rounded-md shadow-lg z-10">
          <ul>
            {loading && <li className="px-4 py-2 flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Загрузка...</li>}
            {!loading && suggestions.map((item, index) => (
              <li 
                key={index} 
                onMouseDown={() => handleSelect(item)} // Use onMouseDown to fire before onBlur
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
