
"use client";

import React from 'react';
import { Percent, Timer, Tag, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/hooks/use-data';
import ServiceCard from '@/components/service-card';
import Link from 'next/link';

export default function PromotionsPage() {
  const { services } = useData();
  
  // Имитируем товары со скидкой (берем первые 4)
  const discountedItems = services.slice(0, 4);

  return (
    <main className="container mx-auto px-4 py-12 space-y-16">
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">
          <Zap className="h-4 w-4" />
          ГОРЯЧИЕ ПРЕДЛОЖЕНИЯ
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">Скидки и Акции</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Найдите лучшие предложения на товары и услуги в Findora. Мы обновляем этот список ежедневно!
        </p>
      </section>

      {/* Сетка баннеров */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 relative overflow-hidden bg-slate-900 text-white border-none min-h-[300px] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop" 
            alt="Big Sale" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <CardContent className="relative z-20 p-8 space-y-4 max-w-md">
            <Badge className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold">ХИТ СЕЗОНА</Badge>
            <h2 className="text-4xl font-bold font-headline">Ночная распродажа: до -50%</h2>
            <p className="text-slate-200">Только на услуги по веб-дизайну и разработке в это воскресенье.</p>
            <Button size="lg" className="rounded-full shadow-lg shadow-primary/20">Участвовать</Button>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground border-none flex flex-col justify-between p-8 relative overflow-hidden">
          <div className="relative z-10">
            <Timer className="h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-2xl font-bold font-headline mb-2">Успей до конца!</h3>
            <p className="opacity-90">Бесплатная доставка на все категории электроники заканчивается через 4 часа.</p>
          </div>
          <Button variant="secondary" className="w-full rounded-full mt-6" asChild>
            <Link href="/">В каталог</Link>
          </Button>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </Card>
      </section>

      {/* Промокоды */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold font-headline flex items-center gap-3">
          <Tag className="text-primary h-8 w-8" />
          Активные промокоды
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { code: 'FINDORA2024', desc: '-15% на первый заказ', type: 'WELCOME' },
            { code: 'SERVICE20', desc: '-20% на все услуги', type: 'SERVICES' },
            { code: 'FREE_SHIP', desc: 'Бесплатная доставка от 500₽', type: 'SHIPPING' },
            { code: 'AI_MAGIC', desc: '-30% на ИИ-инструменты', type: 'AI' }
          ].map((promo) => (
            <div key={promo.code} className="border-2 border-dashed border-primary/30 rounded-2xl p-6 bg-card hover:border-primary transition-colors text-center group">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-2 block">{promo.type}</span>
              <p className="text-2xl font-mono font-bold mb-2 group-hover:scale-110 transition-transform">{promo.code}</p>
              <p className="text-sm text-muted-foreground">{promo.desc}</p>
              <Button variant="ghost" className="w-full mt-4 text-primary font-bold">Копировать</Button>
            </div>
          ))}
        </div>
      </section>

      {/* Товары по акции */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold font-headline">Товары по спеццене</h2>
          <Button variant="link" asChild>
            <Link href="/" className="flex items-center gap-2">
              Все товары <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {discountedItems.map(item => (
            <ServiceCard key={item.id} service={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
