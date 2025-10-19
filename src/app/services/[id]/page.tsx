
"use client";

import { Suspense, use } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddToCartButton from '@/components/add-to-cart-button';
import { FavoriteButton } from '@/components/favorite-button';
import { useData } from '@/hooks/use-data';

function ClientFormattedDate({ dateString }: { dateString: string }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(dateString).toLocaleDateString('ru-RU'));
  }, [dateString]);

  return <>{formattedDate}</>;
}


function ServicePageContent({ id }: { id: string }) {
  const { services, reviews: allReviews } = useData();
  const service = services.find((s) => s.id === id);
  
  if (!service) {
    notFound();
  }

  const serviceReviews = allReviews.filter(review => service.reviews?.includes(review.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-2 font-headline">{service.title}</h1>
          <div className="flex items-center gap-4 mb-6 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-bold text-foreground">{service.rating.toFixed(1)}</span>
              <span>({service.reviewsCount} отзывов)</span>
            </div>
            <span>·</span>
            <Link href={`/profile/${service.provider.username}`} className="hover:text-primary transition-colors flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={service.provider.avatar} />
                <AvatarFallback>{service.provider.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{service.provider.name}</span>
            </Link>
          </div>

          <Carousel className="w-full mb-8">
            <CarouselContent>
              {service.images.map((img, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden rounded-xl">
                    <Image
                      src={img}
                      alt={`${service.title} - изображение ${index + 1}`}
                      width={800}
                      height={500}
                      className="w-full h-auto aspect-video object-cover"
                    />
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold font-headline">Об этой услуге</h2>
            <p>{service.description}</p>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 font-headline">Что говорят люди</h2>
            <div className="space-y-6">
              {serviceReviews.slice(0, 3).map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={review.author.avatar} />
                                <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{review.author.name}</p>
                                <p className="text-sm text-muted-foreground"><ClientFormattedDate dateString={review.date} /></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'}`} />
                            ))}
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6 rounded-xl shadow-sm">
            <CardTitle className="text-2xl mb-4 font-headline flex justify-between items-center">
              <span>{service.category}</span>
              <span className="text-3xl font-bold text-foreground">${service.price}</span>
            </CardTitle>
            <CardContent className="p-0">
              <p className="text-muted-foreground mb-6">Начальная цена за стандартный проект.</p>
              <div className="flex flex-col gap-3">
                <AddToCartButton service={service} />
                <FavoriteButton service={service} as="button" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


export default function ServicePage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  
  return (
    <Suspense fallback={<div>Загрузка услуги...</div>}>
      <ServicePageContent id={id} />
    </Suspense>
  );
}
