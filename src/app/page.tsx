
"use client";

import React, { useState, useMemo } from 'react';
import ServiceCard from '@/components/service-card';
import { services, categories } from '@/lib/data';
import type { Service } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Filter, SlidersHorizontal } from 'lucide-react';
import PromoCard from '@/components/promo-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import HorizontalServiceCard from '@/components/horizontal-service-card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';


export default function Home() {
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const [category, setCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number]>([500]);
  const [rating, setRating] = useState<string>('all');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTopRated, setIsTopRated] = useState(false);
  
  const isMobile = useIsMobile();
  const maxPrice = useMemo(() => Math.max(...services.map(s => s.price)), []);

  const applyFilters = () => {
    let tempServices = services;

    if (category !== 'all') {
      tempServices = tempServices.filter(service => service.category === category);
    }

    tempServices = tempServices.filter(service => service.price <= priceRange[0]);

    if (rating !== 'all') {
      tempServices = tempServices.filter(service => service.rating >= parseInt(rating));
    }
    
    if(isFeatured) {
        tempServices = tempServices.filter(service => service.featured);
    }

    if(isTopRated) {
        tempServices = tempServices.filter(service => service.rating >= 4.9);
    }

    setFilteredServices(tempServices);
  };
  
  const resetFilters = () => {
    setCategory('all');
    setPriceRange([maxPrice]);
    setRating('all');
    setIsFeatured(false);
    setIsTopRated(false);
    setFilteredServices(services);
  }
  
  const FilterContent = () => (
    <div className="space-y-6 p-1">
        <div>
            <Label className="text-lg font-medium mb-2 block font-headline">Category</Label>
            <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>

        <div>
            <Label htmlFor="price-range" className="text-lg font-medium mb-2 block font-headline">
            Max Price: <span className="font-bold text-primary">${priceRange[0]}</span>
            </Label>
            <Slider
            id="price-range"
            min={0}
            max={maxPrice}
            step={10}
            value={priceRange}
            onValueChange={(value: [number]) => setPriceRange(value)}
            />
        </div>

        <div>
            <Label className="text-lg font-medium mb-2 block font-headline">Rating</Label>
            <RadioGroup value={rating} onValueChange={setRating}>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="r-all" />
                <Label htmlFor="r-all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="r-4" />
                <Label htmlFor="r-4">4 stars & up</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="r-3" />
                <Label htmlFor="r-3">3 stars & up</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="r-2" />
                <Label htmlFor="r-2">2 stars & up</Label>
            </div>
            </RadioGroup>
        </div>

        <div className="space-y-4 pt-4">
             <div className="flex items-center justify-between">
                <Label htmlFor="featured-switch" className="text-lg font-medium font-headline">Featured</Label>
                <Switch id="featured-switch" checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="top-rated-switch" className="text-lg font-medium font-headline">Top Rated (4.9+)</Label>
                <Switch id="top-rated-switch" checked={isTopRated} onCheckedChange={setIsTopRated} />
            </div>
        </div>
        
        <div className="flex flex-col space-y-2 pt-4">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button onClick={resetFilters} variant="ghost">Reset Filters</Button>
        </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Promo Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <PromoCard
                image="https://images.unsplash.com/photo-1557800636-894a64c1696f"
                title="Special Offer"
                description="Get 20% off on all web development services this month!"
                ctaText="Learn More"
                ctaLink="#"
                className="lg:col-span-2 min-h-[20rem] md:min-h-[26rem]"
                data-ai-hint="special offer"
            />
            {services.slice(0, 2).map(service => (
                <ServiceCard key={service.id} service={service} />
            ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="mb-16">
          <h2 className="text-3xl font-bold font-headline mb-6">Trending Services</h2>
          <Carousel
              opts={{ align: "start", loop: true, }}
              className="w-full"
          >
              <CarouselContent>
                  {services.map((service) => (
                      <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/3">
                          <div className="p-1">
                              <ServiceCard service={service} />
                          </div>
                      </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="ml-12" />
              <CarouselNext className="mr-12" />
          </Carousel>
      </section>

      {/* Main Content with Filters */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold font-headline">Explore Services</h1>
            {isMobile ? (
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="py-4">
                            <FilterContent />
                        </div>
                    </SheetContent>
                </Sheet>
            ) : (
                <Collapsible>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4" /> Filters</Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="absolute z-20 right-0 mt-2">
                        <div className="w-80 bg-card p-6 rounded-xl shadow-lg border">
                           <FilterContent />
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl">
              <p className="text-muted-foreground text-lg">No services found matching your criteria.</p>
              <Button onClick={resetFilters} className="mt-4">Clear filters</Button>
          </div>
        )}
      </section>
      
      {/* Recommended for you */}
      <section className="mb-16">
          <h2 className="text-3xl font-bold font-headline mb-6">Recommended For You</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.slice(2, 6).map(service => (
                  <HorizontalServiceCard key={service.id} service={service} />
              ))}
          </div>
      </section>
      
      {/* Popular Categories */}
      <section>
          <h2 className="text-3xl font-bold font-headline mb-6">Popular Categories</h2>
          <div className="flex flex-wrap gap-4">
              {categories.map(category => (
                <Link href="#" key={category.id}>
                    <Badge variant="secondary" className="text-lg px-6 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                        {category.name}
                    </Badge>
                </Link>
              ))}
          </div>
      </section>
    </div>
  );
}
