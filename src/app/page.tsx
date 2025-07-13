
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
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, Search } from 'lucide-react';
import PromoCard from '@/components/promo-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import HorizontalServiceCard from '@/components/horizontal-service-card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchBar from '@/components/search-bar';


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
    <div className="flex flex-col">
       {/* Hero Section */}
       <section className="relative bg-background">
          <div className="container mx-auto px-4 py-16 md:py-24 text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold font-headline mb-4 text-balance bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground/70">Find & Hire Expert Talent</h1>
              <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8">The premier marketplace to connect with skilled professionals and bring your ideas to life.</p>
              <div className="max-w-xl mx-auto">
                  <SearchBar />
              </div>
          </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
           {/* Filters */}
           <aside className="w-full lg:w-1/4">
               <div className="sticky top-24">
                   {isMobile ? (
                       <Sheet>
                           <SheetTrigger asChild>
                               <Button variant="outline" className="w-full justify-start"><SlidersHorizontal className="mr-2 h-4 w-4" /> Filters</Button>
                           </SheetTrigger>
                           <SheetContent>
                               <SheetHeader>
                                   <SheetTitle className="font-headline">Filters</SheetTitle>
                               </SheetHeader>
                               <div className="py-4">
                                   <FilterContent />
                               </div>
                           </SheetContent>
                       </Sheet>
                   ) : (
                       <>
                           <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2"><SlidersHorizontal className="h-5 w-5"/> Filters</h2>
                           <FilterContent />
                       </>
                   )}
               </div>
           </aside>

           {/* Service Listings */}
            <main className="w-full lg:w-3/4">
                <section className="mb-16">
                    <h2 className="text-3xl font-bold font-headline mb-6">Trending Services</h2>
                    <Carousel opts={{ align: "start", loop: true, }} className="w-full">
                        <CarouselContent>
                            {services.filter(s => s.featured).map((service) => (
                                <CarouselItem key={service.id} className="md:basis-1/2 xl:basis-1/3">
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
                
                <section className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold font-headline">Explore All Services</h2>
                    </div>

                    {filteredServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredServices.map(service => (
                            <ServiceCard key={service.id} service={service} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-card rounded-xl">
                            <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                            <p className="text-muted-foreground text-lg font-semibold">No services found</p>
                            <p className="text-muted-foreground">Try adjusting your filters.</p>
                            <Button onClick={resetFilters} className="mt-4">Clear filters</Button>
                        </div>
                    )}
                </section>

                <section className="mb-16">
                    <h2 className="text-3xl font-bold font-headline mb-6">Recommended For You</h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {services.slice(2, 6).map(service => (
                            <HorizontalServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                </section>
                
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
            </main>
        </div>
      </div>
    </div>
  );
}
