
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Trash2, Plus, Minus, Package, Loader2 } from 'lucide-react';
import { useData } from '@/hooks/use-data';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useState } from 'react';


export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice, cartCount } = useCart();
  const { createOrderFromCart } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const handleCheckout = () => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: "Ошибка",
            description: "Вы должны быть авторизованы, чтобы оформить заказ.",
        });
        router.push('/login');
        return;
    }
    
    // Open the dialog to collect address and phone
    setIsDialogOpen(true);
  };
  
  const handleConfirmOrder = () => {
    if (!address.trim() || !phone.trim()) {
      toast({
        variant: 'destructive',
        title: "Ошибка",
        description: "Пожалуйста, введите ваш адрес и телефон.",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
        createOrderFromCart(cartItems);
        clearCart();
        toast({
          title: "Заказ оформлен!",
          description: "Ваши товары скоро будут у вас. Спасибо за покупку!",
        });
        setIsProcessing(false);
        setIsDialogOpen(false);
        router.push(`/profile/${user!.username}`);
    }, 1500);

  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <ShoppingCart className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold font-headline">Корзина</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl flex flex-col items-center justify-center">
          <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 font-headline">Ваша корзина пуста</h2>
          <p className="text-muted-foreground mb-6">Похоже, вы еще не добавили ни одного товара.</p>
          <Button asChild>
            <Link href="/">Посмотреть товары</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{cartCount} {cartCount === 1 ? 'Товар' : (cartCount > 1 && cartCount < 5 ? 'Товара' : 'Товаров')} в корзине</CardTitle>
                    <Button variant="outline" size="sm" onClick={clearCart}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Очистить корзину
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
                                <p className="text-lg font-bold text-primary mt-1">{item.price.toFixed(2)} TJS</p>
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Card className="sticky top-24">
                  <CardHeader>
                      <CardTitle>Сумма заказа</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex justify-between">
                          <span className="text-muted-foreground">Промежуточный итог</span>
                          <span>{totalPrice.toFixed(2)} TJS</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-muted-foreground">Налоги</span>
                          <span>Рассчитываются при оформлении</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between font-bold text-lg">
                          <span>Итого</span>
                          <span>{totalPrice.toFixed(2)} TJS</span>
                      </div>
                      <DialogTrigger asChild>
                        <Button size="lg" className="w-full mt-4" onClick={handleCheckout}>
                            Перейти к оформлению
                        </Button>
                      </DialogTrigger>
                  </CardContent>
              </Card>
               <DialogContent>
                <DialogHeader>
                  <DialogTitle>Подтверждение заказа</DialogTitle>
                  <DialogDescription>
                    Пожалуйста, введите ваш адрес и телефон для завершения заказа.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Адрес
                    </Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" placeholder="ул. Примерная, д. 1, кв. 2" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Телефон
                    </Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" placeholder="+7 (999) 123-45-67" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Отмена</Button>
                  </DialogClose>
                  <Button onClick={handleConfirmOrder} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isProcessing ? 'Обработка...' : 'Подтвердить заказ'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}
