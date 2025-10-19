"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/data';
import { Label } from '@/components/ui/label';
import { SlidersHorizontal } from 'lucide-react';

export interface FilterState {
  category: string;
  priceRange: number[];
  rating: number;
  featured: boolean;
  topRated: boolean;
}

interface FilterSidebarProps {
  onApplyFilters: (filters: FilterState) => void;
}

export default function FilterSidebar({ onApplyFilters }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: [0, 500],
    rating: 0,
    featured: false,
    topRated: false
  });

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }));
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
  };

  const handleRatingChange = (value: string) => {
    setFilters(prev => ({ ...prev, rating: Number(value) }));
  };

  const handleFeaturedChange = (checked: boolean) => {
    setFilters(prev => ({ ...prev, featured: checked }));
  };

  const handleTopRatedChange = (checked: boolean) => {
    setFilters(prev => ({ ...prev, topRated: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <SlidersHorizontal className="h-5 w-5" />
          Фильтры
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="category">Категория</Label>
            <Select onValueChange={handleCategoryChange} defaultValue={filters.category}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Ценовой диапазон: ${filters.priceRange[0]} - ${filters.priceRange[1]}</Label>
            <Slider 
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              max={500} 
              step={10} 
              minStepsBetweenThumbs={1}
            />
          </div>
          
          <div>
            <Label htmlFor="rating">Рейтинг</Label>
            <Select onValueChange={handleRatingChange} defaultValue={String(filters.rating)}>
              <SelectTrigger id="rating">
                <SelectValue placeholder="Любой рейтинг" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Любой рейтинг</SelectItem>
                <SelectItem value="4.5">4.5 звезды и выше</SelectItem>
                <SelectItem value="4">4 звезды и выше</SelectItem>
                <SelectItem value="3">3 звезды и выше</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
             <div className="flex items-center space-x-2">
                <Checkbox 
                    id="featured" 
                    checked={filters.featured} 
                    onCheckedChange={handleFeaturedChange}
                />
                <Label htmlFor="featured" className="font-normal">Рекомендуемые</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox 
                    id="top-rated" 
                    checked={filters.topRated}
                    onCheckedChange={handleTopRatedChange}
                />
                <Label htmlFor="top-rated" className="font-normal">С высоким рейтингом</Label>
            </div>
          </div>
          
          <Button type="submit" className="w-full">Применить фильтры</Button>
        </form>
      </CardContent>
    </Card>
  );
}
