
"use client";

import HorizontalServiceCard from '@/components/horizontal-service-card';
import PromoCard from '@/components/promo-card';
import ServiceCard from '@/components/service-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { services } from '@/lib/data';
import { LayoutGrid } from 'lucide-react';

export default function LayoutsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <LayoutGrid className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold font-headline">Layout Showcase</h1>
            </div>

            {/* Carousel Section */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold font-headline mb-6">Carousel Layout</h2>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
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
            
            {/* Grid with Promo card */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold font-headline mb-6">Mixed Grid with Promo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <PromoCard
                        image="https://images.unsplash.com/photo-1557800636-894a64c1696f"
                        title="Special Offer"
                        description="Get 20% off on all web development services this month!"
                        ctaText="Learn More"
                        ctaLink="#"
                        className="lg:col-span-2"
                    />
                    {services.slice(0, 2).map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </section>
            
            {/* Horizontal Cards List */}
            <section>
                <h2 className="text-3xl font-bold font-headline mb-6">Horizontal List Layout</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {services.slice(2, 6).map(service => (
                        <HorizontalServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </section>
        </div>
    );
}
