
"use client";

import React from 'react';
import Image from 'next/image';
import { Search, SlidersHorizontal, Star, Zap, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/service-card';
import HorizontalServiceCard from '@/components/horizontal-service-card';
import PromoCard from '@/components/promo-card';
import { services, categories } from '@/lib/data';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export default function Home() {
  const featuredServices = services.filter(s => s.featured);
  const trendingServices = services.slice(0, 4);
  const newArrivals = services.slice(2, 6);

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
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for services like 'logo design' or 'website development'..."
                className="w-full h-14 pl-12 pr-4 text-base rounded-full shadow-lg text-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        
        <Collapsible className="mb-12">
          <div className="flex justify-end mb-4">
            <CollapsibleTrigger asChild>
                <Button variant="outline">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
             <div className="p-6 border rounded-xl bg-card text-card-foreground">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <label className="text-sm font-medium mb-2 block">Price Range</label>
                        <Slider defaultValue={[50]} max={100} step={1} />
                    </div>
                     <div>
                        <label className="text-sm font-medium mb-2 block">Rating</label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Any Rating" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="4.5">4.5 Stars & Up</SelectItem>
                                <SelectItem value="4">4 Stars & Up</SelectItem>
                                <SelectItem value="3">3 Stars & Up</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end space-x-4">
                         <div className="flex items-center space-x-2">
                            <Checkbox id="featured" />
                            <label htmlFor="featured" className="text-sm font-medium">Featured</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="top-rated" />
                            <label htmlFor="top-rated" className="text-sm font-medium">Top Rated</label>
                        </div>
                    </div>
                </div>
             </div>
          </CollapsibleContent>
        </Collapsible>


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
                    <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
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

      </main>
    </>
  );
}

    