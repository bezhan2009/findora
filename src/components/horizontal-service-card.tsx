
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Heart, Star } from 'lucide-react';
import type { Service } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import { Badge } from './ui/badge';

interface HorizontalServiceCardProps {
  service: Service;
}

export default function HorizontalServiceCard({ service }: HorizontalServiceCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(service.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    favorite ? removeFavorite(service.id) : addFavorite(service.id);
  };

  return (
    <Link href={`/services/${service.id}`} className="group">
      <Card className="overflow-hidden h-full flex flex-row transition-all duration-300 hover:shadow-xl hover:border-primary/50">
        <div className="relative w-1/3">
            <Image
                src={service.images[0]}
                alt={service.title}
                fill
                className="object-cover"
            />
        </div>
        <div className="w-2/3 flex flex-col">
            <CardContent className="p-4 flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{service.category}</p>
                    <h3 className="text-lg font-headline leading-tight font-semibold group-hover:text-primary transition-colors">
                        {service.title}
                    </h3>
                     <div className="flex items-center gap-1 text-sm font-semibold my-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{service.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground font-normal">
                        ({service.reviewsCount})
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <Link
                        href={`/profile/${service.provider.username}`}
                        className="flex items-center gap-2 group-hover:text-primary transition-colors"
                    >
                        <Avatar className="h-6 w-6">
                        <AvatarImage
                            src={service.provider.avatar}
                            alt={service.provider.name}
                        />
                        <AvatarFallback>{service.provider.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                        {service.provider.name}
                        </p>
                    </Link>
                    <p className="text-lg font-bold text-foreground">
                        ${service.price}
                    </p>
                </div>
            </CardContent>
        </div>
      </Card>
    </Link>
  );
}
