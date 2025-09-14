
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice, cartCount } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <ShoppingCart className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold font-headline">Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl flex flex-col items-center justify-center">
          <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 font-headline">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any services yet.</p>
          <Button asChild>
            <Link href="/">Explore Services</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{cartCount} {cartCount === 1 ? 'Service' : 'Services'} in Cart</CardTitle>
                    <Button variant="outline" size="sm" onClick={clearCart}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear Cart
                    </Button>
                </CardHeader>
                <CardContent>
                     <ScrollArea className="h-[60vh]">
                        <div className="space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-start gap-4">
                            <div className="relative h-24 w-24 rounded-lg overflow-hidden">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-grow">
                                <Link href={`/services/${item.id}`} className="font-semibold hover:text-primary transition-colors">{item.name}</Link>
                                <p className="text-lg font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
                                <div className="flex items-center gap-2 mt-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value, 10);
                                        if (value > 0) updateQuantity(item.id, value);
                                    }}
                                    className="h-8 w-14 text-center"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => removeFromCart(item.id)}
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                            </div>
                        ))}
                        </div>
                     </ScrollArea>
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes</span>
                        <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                     <Button size="lg" className="w-full mt-4">
                        Proceed to Checkout
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
