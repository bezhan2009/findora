
"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, Truck, Percent, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/service-card';
import { useData } from '@/hooks/use-data';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

function SearchResults({ query }: { query: string }) {
  const { services } = useData();
  const lowercasedQuery = query.toLowerCase();
  const filtered = services.filter(s => 
    s.title.toLowerCase().includes(lowercasedQuery) || 
    s.category.toLowerCase().includes(lowercasedQuery)
  );

  if (filtered.length === 0) {
    return (
      <div className="text-center py-20 bg-card rounded-xl border border-dashed">
        <h3 className="text-2xl font-semibold mb-2 font-headline">Ничего не найдено</h3>
        <p className="text-muted-foreground">Попробуйте изменить запрос "{query}"</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {filtered.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const { services } = useData();
  const searchQuery = searchParams.get('q');

  const popularProducts = services.filter(s => !['Графический дизайн', 'Маркетинг', 'Написание текстов'].includes(s.category)).slice(0, 6);
  const popularServices = services.filter(s => ['Графический дизайн', 'Маркетинг', 'Написание текстов'].includes(s.category)).slice(0, 6);

  if (searchQuery) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold font-headline mb-6">Результаты поиска: {searchQuery}</h2>
        <SearchResults query={searchQuery} />
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      {/* Секция баннеров */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white group h-64 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="bg-white/20 backdrop-blur-md w-fit p-2 rounded-xl mb-4">
              <Percent className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold font-headline mb-2 leading-tight">Скидка 20% <br/> на все услуги</h3>
            <p className="text-white/80">Только до конца недели</p>
          </div>
          <Button variant="secondary" className="w-fit relative z-10 rounded-full font-bold px-8 transition-transform hover:scale-105 active:scale-95" asChild>
            <Link href="/promotions">Купить</Link>
          </Button>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white group h-64 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="bg-white/20 backdrop-blur-md w-fit p-2 rounded-xl mb-4">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold font-headline mb-2 leading-tight">Бесплатная доставка <br/> при заказе от 3000 TJS</h3>
            <p className="text-white/80">По всему Таджикистану</p>
          </div>
          <Button variant="secondary" className="w-fit relative z-10 rounded-full font-bold px-8 transition-transform hover:scale-105 active:scale-95" asChild>
            <Link href="/promotions">Заказать</Link>
          </Button>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-16 -mb-16 blur-3xl" />
        </div>
      </section>

      {/* Популярные товары */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-grow">
            <div className="h-px bg-border flex-grow hidden sm:block" />
            <h2 className="text-2xl font-bold font-headline whitespace-nowrap px-4">Популярные товары</h2>
            <div className="h-px bg-border flex-grow hidden sm:block" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {popularProducts.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Популярные услуги */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-grow">
            <div className="h-px bg-border flex-grow hidden sm:block" />
            <h2 className="text-2xl font-bold font-headline whitespace-nowrap px-4">Популярные услуги</h2>
            <div className="h-px bg-border flex-grow hidden sm:block" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {popularServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Спецпредложения */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-grow">
            <div className="h-px bg-border flex-grow hidden sm:block" />
            <h2 className="text-2xl font-bold font-headline whitespace-nowrap px-4">Спецпредложения</h2>
            <div className="h-px bg-border flex-grow hidden sm:block" />
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 text-primary font-bold mb-4">
              <Gift className="h-6 w-6" />
              <span>БОНУСНАЯ ПРОГРАММА</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold font-headline mb-4">Закажи товар и получи скидку 30% на первую услугу</h3>
            <p className="text-muted-foreground text-lg mb-8">Используйте возможности Findora по максимуму. Мы объединяем качественные товары и лучших специалистов на одной платформе.</p>
            <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20 group" asChild>
              <Link href="/bonus-program">
                Подробнее
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
        </div>
      </section>
    </main>
  );
}

function PageFallback() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full rounded-[2rem]" />
        <Skeleton className="h-64 w-full rounded-[2rem]" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 mx-auto" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<PageFallback />}>
      <HomePageContent />
    </Suspense>
  );
}
