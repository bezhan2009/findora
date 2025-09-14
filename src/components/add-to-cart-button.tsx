
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import type { Service } from '@/lib/types';
import { ShoppingCart, Check } from 'lucide-react';

interface AddToCartButtonProps {
  service: Service;
}

export default function AddToCartButton({ service }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: service.id,
      name: service.title,
      price: service.price,
      quantity: 1,
      image: service.images[0],
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button size="lg" onClick={handleAddToCart} disabled={isAdded}>
      {isAdded ? (
        <>
          <Check className="mr-2 h-5 w-5" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
