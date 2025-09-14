"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Star, Award } from 'lucide-react';
import type { Service } from '@/lib/types';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { FavoriteButton } from './favorite-button';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [imageSrc, setImageSrc] = useState(service.images[0]);

  const handleProviderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleImageError = () => {
    setImageSrc('https://placehold.co/400x400/F9F9F9/333333?text=Image+Not+Found');
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group bg-card">
      <Link href={`/services/${service.id}`} className="block">
        <CardHeader className="p-0 relative">
          <Image
            src={imageSrc}
            alt={service.title}
            width={400}
            height={400}
            className="w-full h-auto aspect-square object-cover"
            data-ai-hint="product image"
            onError={handleImageError}
          />
          {service.featured && (
            <Badge className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm text-primary-foreground border-none" variant="default">
              <Award className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
            <FavoriteButton service={service} />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <p className="text-sm text-muted-foreground mb-1">{service.category}</p>
          <Link href={`/services/${service.id}`} className="block">
            <CardTitle className="text-base font-headline leading-tight h-10 group-hover:text-primary transition-colors">
              {service.title}
            </CardTitle>
          </Link>
        </div>
        <div className="flex items-center gap-2 mt-2" onClick={handleProviderClick}>
          <Link
            href={`/profile/${service.provider.username}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={service.provider.avatar}
                alt={service.provider.name}
              />
              <AvatarFallback>{service.provider.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">
              {service.provider.name}
            </p>
          </Link>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center border-t">
        <div className="flex items-center gap-1 text-sm font-semibold">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span>{service.rating.toFixed(1)}</span>
          <span className="text-muted-foreground font-normal text-xs">
            ({service.reviewsCount})
          </span>
        </div>
        <div className="text-base font-semibold text-foreground">
          <span className="text-xs font-normal text-muted-foreground">FROM </span>$
          {service.price}
        </div>
      </CardFooter>
    </Card>
  );
}