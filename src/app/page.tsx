
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Award, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/service-card';
import HorizontalServiceCard from '@/components/horizontal-service-card';
import PromoCard from '@/components/promo-card';
import { services, categories } from '@/lib/data';
import type { Service, Category } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Link from 'next/link';
import PageSearchInput from '@/components/page-search-input';
import FilterSidebar, { type FilterState } from '@/components/filter-sidebar';

function SearchResults({ services, query }: { services: Service[], query: string }) {
  if (services.length === 0) {
    return (
        <div className="text-center py-20 bg-card rounded-xl">
            <h3 className="text-2xl font-semibold mb-2 font-headline">No services found for &quot;{query}&quot;</h3>
            <p className="text-muted-foreground">Try a different search term or adjust your filters.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {services.map(service => (
            <ServiceCard key={service.id} service={service} />
        ))}
    </div>
  );
}

export default function Home() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q');
  
  const [allServices] = useState<Service[]>(services);
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    category: 'all',
    priceRange: [0, 500],
    rating: 0,
    featured: false,
    topRated: false,
  });

  useEffect(() => {
    let results = allServices;

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      results = results.filter(service =>
        service.title.toLowerCase().includes(lowercasedQuery) ||
        service.description.toLowerCase().includes(lowercasedQuery) ||
        service.category.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    // Apply filters
    if (activeFilters.category !== 'all') {
      results = results.filter(service => service.category === activeFilters.category);
    }

    results = results.filter(service => service.price >= activeFilters.priceRange[0] && service.price <= activeFilters.priceRange[1]);

    if (activeFilters.rating > 0) {
        results = results.filter(service => service.rating >= activeFilters.rating);
    }

    if(activeFilters.featured) {
        results = results.filter(service => service.featured);
    }

    if(activeFilters.topRated) {
        results = results.filter(service => service.rating >= 4.8);
    }


    setFilteredServices(results);
  }, [searchQuery, allServices, activeFilters]);

  const featuredServices = services.filter(s => s.featured);
  const trendingServices = services.slice(0, 4);
  const newArrivals = services.slice(2, 6);

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  return (
    <>
      <section className="relative h-[60vh] w-full flex items-center justify-center text-white -mt-16">
        <Image
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
          alt="Hero background"
          layout="fill"
          objectFit="cover"
          className="z-0"
          priority
          data-ai-hint="team working"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 flex flex-col items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight mb-4">
            Find The Perfect Service, Instantly.
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mb-8">
            BizMart is your premier marketplace for discovering and booking high-quality services from trusted professionals.
          </p>
          <div className="w-full max-w-2xl">
            <PageSearchInput />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
             {searchQuery ? (
                <div>
                    <h2 className="text-3xl font-bold font-headline mb-6">
                        Results for &quot;{searchQuery}&quot;
                    </h2>
                    <SearchResults services={filteredServices} query={searchQuery} />
                </div>
            ) : (
              <>
                <section className="mb-16">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold font-headline flex items-center gap-2">
                        <Zap className="h-7 w-7 text-primary" />
                        Featured Services
                    </h2>
                    <Button variant="outline" asChild>
                        <Link href="#">View All</Link>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {featuredServices.map(service => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                </section>

                <section className="mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <PromoCard
                            image="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                            title="Grow Your Business"
                            description="Find top-tier marketing and SEO experts to boost your brand."
                            ctaText="Explore Marketing"
                            ctaLink="#"
                            data-ai-hint="marketing team"
                        />
                         <PromoCard
                            image="https://images.unsplash.com/photo-1626785774573-4b799315345d"
                            title="Creative Design Solutions"
                            description="From logos to full branding packages, find the right designer."
                            ctaText="Discover Designers"
                            ctaLink="#"
                            data-ai-hint="graphic design"
                        />
                    </div>
                </section>
                
                <section className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold font-headline flex items-center gap-2">
                            <Star className="h-7 w-7 text-primary" />
                            Trending Services
                        </h2>
                         <Button variant="outline" asChild>
                            <Link href="#">View All</Link>
                        </Button>
                    </div>
                    <Carousel opts={{ align: "start", loop: true }} className="w-full">
                        <CarouselContent>
                            {trendingServices.map(service => (
                            <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/2 xl:basis-1/3">
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
                        <h2 className="text-3xl font-bold font-headline flex items-center gap-2">
                            <Award className="h-7 w-7 text-primary" />
                           Popular Categories
                        </h2>
                    </div>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categories.map(category => (
                            <Link key={category.id} href="#" className="block">
                                <div className="p-6 bg-card rounded-xl text-center hover:bg-accent hover:text-accent-foreground transition-colors">
                                    <p className="font-semibold">{category.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                             <h2 className="text-3xl font-bold font-headline mb-4">New Arrivals</h2>
                             <p className="text-muted-foreground mb-6">Check out the latest services added by our talented providers.</p>
                             <Button>Browse All New Services</Button>
                        </div>
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {newArrivals.map(service => (
                                    <HorizontalServiceCard key={service.id} service={service} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
              </>
            )}
          </div>
          <aside className="lg:col-span-1">
              <FilterSidebar onApplyFilters={handleApplyFilters} />
          </aside>
        </div>
      </main>
    </>
  );
}
