"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Award, Star, Zap, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/service-card';
import HorizontalServiceCard from '@/components/horizontal-service-card';
import PromoCard from '@/components/promo-card';
import { services, categories } from '@/lib/data';
import type { Service } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Link from 'next/link';
import PageSearchInput from '@/components/page-search-input';
import FilterSidebar, { type FilterState } from '@/components/filter-sidebar';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function SearchResults({ services, query }: { services: Service[], query: string }) {
  if (services.length === 0) {
    return (
        <div className="text-center py-20 bg-card rounded-xl">
            <SearchIcon className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2 font-headline">По запросу "{query}" ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте другой поисковый запрос или измените фильтры.</p>
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

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q');
  const categoryQuery = searchParams.get('category');
  
  const [allServices] = useState<Service[]>(services);
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    category: categoryQuery || 'all',
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
    const currentCategory = categoryQuery || activeFilters.category;
    if (currentCategory !== 'all') {
      results = results.filter(service => service.category === currentCategory);
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
  }, [searchQuery, categoryQuery, allServices, activeFilters]);

  const featuredServices = services.filter(s => s.featured);
  const trendingServices = services.slice(0, 4);
  const newArrivals = services.slice(2, 6);

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
    const params = new URLSearchParams(window.location.search);
    if (filters.category && filters.category !== 'all') {
      params.set('category', filters.category);
    } else {
      params.delete('category');
    }
    router.push(`?${params.toString()}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('category', categoryName);
    params.delete('q'); // Clear search query when a category is clicked
    router.push(`?${params.toString()}`);
    setActiveFilters(prev => ({...prev, category: categoryName}));
  };

  const isFiltering = searchQuery || (categoryQuery && categoryQuery !== 'all');

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
            Найдите идеальную услугу. Мгновенно.
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mb-8">
            BizMart - ваша главная площадка для поиска и заказа качественных услуг от проверенных профессионалов.
          </p>
          <div className="w-full max-w-2xl">
            <PageSearchInput />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
             {isFiltering ? (
                <div>
                    <h2 className="text-3xl font-bold font-headline mb-6">
                        Результаты {searchQuery && `по запросу "${searchQuery}"`} {categoryQuery && `в категории ${categoryQuery}`}
                    </h2>
                    <SearchResults services={filteredServices} query={searchQuery || categoryQuery || ""} />
                </div>
            ) : (
              <>
                <section className="mb-16">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold font-headline flex items-center gap-2">
                        <Zap className="h-7 w-7 text-primary" />
                        Рекомендуемые услуги
                    </h2>
                    <Button variant="outline" asChild>
                        <Link href="#">Смотреть все</Link>
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
                            title="Развивайте свой бизнес"
                            description="Найдите лучших экспертов по маркетингу и SEO для продвижения вашего бренда."
                            ctaText="Изучить маркетинг"
                            ctaLink="#"
                            data-ai-hint="marketing team"
                        />
                         <PromoCard
                            image="https://images.unsplash.com/photo-1626785774573-4b799315345d"
                            title="Креативные дизайн-решения"
                            description="От логотипов до полного брендинга — найдите подходящего дизайнера."
                            ctaText="Найти дизайнеров"
                            ctaLink="#"
                            data-ai-hint="graphic design"
                        />
                    </div>
                </section>
                
                <section className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold font-headline flex items-center gap-2">
                            <Star className="h-7 w-7 text-primary" />
                            Популярные услуги
                        </h2>
                         <Button variant="outline" asChild>
                            <Link href="#">Смотреть все</Link>
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
                           Популярные категории
                        </h2>
                    </div>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.name)}
                                className={cn(
                                    "p-6 bg-card rounded-xl text-center font-semibold hover:bg-accent hover:text-accent-foreground transition-colors",
                                    categoryQuery === category.name && "bg-primary text-primary-foreground"
                                )}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                             <h2 className="text-3xl font-bold font-headline mb-4">Новые поступления</h2>
                             <p className="text-muted-foreground mb-6">Ознакомьтесь с последними услугами, добавленными нашими талантливыми исполнителями.</p>
                             <Button>Просмотреть все новые услуги</Button>
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

function PageFallback() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
        </div>
        <aside className="lg:col-span-1">
            <Skeleton className="h-screen w-full" />
        </aside>
      </div>
    </div>
  )
}

export default function Home() {
    return (
        <Suspense fallback={<PageFallback />}>
            <HomePageContent />
        </Suspense>
    )
}
