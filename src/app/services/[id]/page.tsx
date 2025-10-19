
"use client";

import { Suspense, use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import AddToCartButton from '@/components/add-to-cart-button';
import { FavoriteButton } from '@/components/favorite-button';
import { useData } from '@/hooks/use-data';
import { useAuth } from '@/hooks/use-auth';
import type { Review } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import ReviewCard from '@/components/review-card';

function ClientFormattedDate({ dateString }: { dateString: string }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(dateString).toLocaleDateString('ru-RU'));
  }, [dateString]);

  return <>{formattedDate}</>;
}

const reviewFormSchema = z.object({
  comment: z.string().min(10, { message: 'Отзыв должен содержать не менее 10 символов.' }).max(500, { message: 'Отзыв не может превышать 500 символов.' }),
  rating: z.number().min(1, { message: 'Рейтинг не может быть пустым.' }).max(5),
});

function AddReviewForm({ serviceId, onReviewSubmit }: { serviceId: string, onReviewSubmit: () => void }) {
  const { user } = useAuth();
  const { addReview } = useData();
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      comment: '',
      rating: 0,
    },
  });

  if (!user) {
    return (
      <div className="text-center text-muted-foreground p-4 border-dashed border-2 rounded-lg">
        <Link href="/login" className="text-primary underline">Войдите</Link>, чтобы оставить отзыв.
      </div>
    )
  }

  const onSubmit = (values: z.infer<typeof reviewFormSchema>) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      providerId: '', // The data provider will associate it
      author: {
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      },
      rating: values.rating,
      comment: values.comment,
      date: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
    };
    addReview(serviceId, newReview);
    form.reset();
    onReviewSubmit();
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Оставить отзыв</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ваша оценка</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(0)}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-6 w-6 cursor-pointer transition-colors ${
                                                    (hoveredRating >= star || field.value >= star)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-muted-foreground/30'
                                                }`}
                                                onMouseEnter={() => setHoveredRating(star)}
                                                onClick={() => field.onChange(star)}
                                            />
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ваш комментарий</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Поделитесь своим мнением о товаре или услуге..."
                                        {...field}
                                        rows={4}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting}>Отправить отзыв</Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  )
}

function ServicePageContent({ id }: { id: string }) {
  const { services, reviews: allReviews } = useData();
  const service = services.find((s) => s.id === id);
  
  const [serviceReviews, setServiceReviews] = useState<Review[]>([]);
  
  useEffect(() => {
    if (service) {
      setServiceReviews(allReviews.filter(review => service.reviews?.includes(review.id)));
    }
  }, [id, service, allReviews, services]);

  if (!service) {
    notFound();
  }
  
  const [imageSources, setImageSources] = useState(service.images);

  const handleImageError = (index: number) => {
    const newImageSources = [...imageSources];
    newImageSources[index] = 'https://placehold.co/800x500/F9F9F9/333333?text=Image+Not+Found';
    setImageSources(newImageSources);
  };
  
  const handleReviewSubmit = () => {
    // This function will re-filter the reviews when a new one is submitted.
    const updatedService = services.find((s) => s.id === id);
    if(updatedService) {
        setServiceReviews(allReviews.filter(review => updatedService.reviews?.includes(review.id)));
    }
  };

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
              {imageSources.map((img, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden rounded-xl">
                    <Image
                      src={img}
                      alt={`${service.title} - изображение ${index + 1}`}
                      width={800}
                      height={500}
                      className="w-full h-auto aspect-video object-cover"
                      onError={() => handleImageError(index)}
                    />
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          <div className="prose max-w-none mb-12">
            <h2 className="text-2xl font-bold font-headline">Об этом товаре/услуге</h2>
            <p>{service.description}</p>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 font-headline">Что говорят люди ({serviceReviews.length})</h2>
            <div className="space-y-6 mb-8">
              {serviceReviews.length > 0 ? (
                 serviceReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                 ))
              ) : (
                <p className="text-muted-foreground text-center py-8">Для этого товара еще нет отзывов. Будьте первым!</p>
              )}
            </div>
            <AddReviewForm serviceId={service.id} onReviewSubmit={handleReviewSubmit} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6 rounded-xl shadow-sm">
            <CardTitle className="text-2xl mb-4 font-headline flex justify-between items-center">
              <span>{service.category}</span>
              <span className="text-3xl font-bold text-foreground">${service.price}</span>
            </CardTitle>
            <CardContent className="p-0">
              <p className="text-muted-foreground mb-6">Начальная цена за стандартный проект/товар.</p>
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
    <Suspense fallback={<div>Загрузка товара...</div>}>
      <ServicePageContent id={id} />
    </Suspense>
  );
}
