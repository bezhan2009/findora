
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface PromoCardProps {
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  className?: string;
  'data-ai-hint'?: string;
}

export default function PromoCard({ image, title, description, ctaText, ctaLink, className, 'data-ai-hint': dataAiHint }: PromoCardProps) {
  return (
    <Card className={cn("overflow-hidden relative group w-full h-full min-h-[26rem]", className)}>
        <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={dataAiHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <CardContent className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
            <h3 className="text-3xl font-bold font-headline mb-2">{title}</h3>
            <p className="text-lg text-white/90 mb-4">{description}</p>
            <Button asChild className="w-fit">
                <Link href={ctaLink}>
                    {ctaText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </CardContent>
    </Card>
  );
}
