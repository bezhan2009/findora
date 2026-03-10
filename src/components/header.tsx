"use client";

import Link from 'next/link';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, User, Heart, MessageSquare, LogOut, LogIn, LayoutDashboard, Bell, Sparkles, Languages, ShoppingCart, Play, PenSquare, Compass } from 'lucide-react';
import Logo from './logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { ThemeToggle } from './theme-toggle';
import SearchBar from './search-bar';
import { useCart } from '@/hooks/use-cart';
import { Badge } from './ui/badge';
import { useState, useMemo } from 'react';
import { useData } from '@/hooks/use-data';


const navLinks = [
  { href: '/favorites', label: 'Избранное', icon: Heart, roles: ['customer', 'provider'] },
  { href: '/chat', label: 'Сообщения', icon: MessageSquare, roles: ['customer', 'provider'] },
  { href: '/dashboard', label: 'Панель', icon: LayoutDashboard, roles: ['provider'] },
];

export default function Header() {
  const { user, logout, role } = useAuth();
  const { cartCount } = useCart();
  const { services, users: allUsers } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const recentActivity = useMemo(() => {
    if (!user || role !== 'provider') return [];
    
    const providerServices = services.filter(s => s.provider.username === user.username);

    return allUsers
        .flatMap(u => (u.orders || []).map(order => ({...order, customer: u})))
        .filter(order => providerServices.some(s => s.title === order.serviceTitle))
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map(order => ({
            id: order.id,
            name: order.customer.name,
            action: 'разместил(а) заказ.',
            service: `На "${order.serviceTitle}".`,
            time: `${Math.round((new Date().getTime() - new Date(order.date).getTime()) / (1000 * 60 * 60))} ч. назад`,
            avatar: order.customer.avatar,
        }));
  }, [user, role, services, allUsers]);


  const getNavLinks = () => {
      if (!user) return [];
      return navLinks.filter(link => link.roles.includes(role || 'customer'));
  }
  
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="hidden md:block">
            <Logo />
          </div>
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 p-4">
                <Logo />
                <nav className="flex flex-col gap-4">
                  <Link onClick={handleLinkClick} href="/" className="flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground">Главная</Link>
                  {getNavLinks().map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </Link>
                  ))}
                   {!user && (
                     <>
                      <Link href="/login" onClick={handleLinkClick} className="flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground">
                        <LogIn className="h-5 w-5" />
                        Войти
                      </Link>
                      <Link href="/register" onClick={handleLinkClick} className="flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground">
                        <User className="h-5 w-5" />
                        Регистрация
                      </Link>
                     </>
                   )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
             <Link
                href="/"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Главная
              </Link>
            {getNavLinks().map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex-1 mx-4 md:mx-8 max-w-md hidden sm:block">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
           <Button asChild variant="ghost" size="icon" className="relative h-10 w-10">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                   <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 min-w-0 p-0 flex items-center justify-center text-[10px] font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </Badge>
                )}
                <span className="sr-only">Корзина</span>
              </Link>
            </Button>
          {user ? (
            <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10">
                  <Bell className="h-5 w-5" />
                   {recentActivity.length > 0 && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                    </span>
                   )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-2">
                <DropdownMenuLabel className="font-headline font-bold">Уведомления</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                        <DropdownMenuItem key={activity.id} asChild className="cursor-pointer rounded-lg mb-1">
                            <Link href={`/dashboard?highlight=${activity.id}`} className="flex items-start gap-3 p-2">
                                 <Avatar className="h-9 w-9 mt-1 border">
                                    <AvatarImage src={activity.avatar} />
                                    <AvatarFallback>{activity.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-tight">{activity.name} {activity.action}</p>
                                    <p className="text-xs text-muted-foreground">{activity.service}</p>
                                    <p className="text-[10px] text-primary font-medium">{activity.time}</p>
                                </div>
                            </Link>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <div className="py-8 text-center">
                        <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Нет новых уведомлений</p>
                    </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">@{user.username}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                  <Link href={`/profile/${user.username}`}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Мой профиль</span>
                  </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild className="cursor-pointer rounded-md text-primary font-medium bg-primary/5 focus:bg-primary/10">
                   <Link href="/ai-chat">
                     <Sparkles className="mr-2 h-4 w-4" />
                     <span>AI Ассистент Findora</span>
                   </Link>
                 </DropdownMenuItem>
                 {getNavLinks().map((link) => (
                   <DropdownMenuItem key={link.href} asChild className="cursor-pointer rounded-md">
                     <Link href={link.href}>
                       <link.icon className="mr-2 h-4 w-4" />
                       <span>{link.label}</span>
                     </Link>
                   </DropdownMenuItem>
                 ))}
                 <DropdownMenuSeparator />
                 <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                  <Link href="/ai-creator">
                    <PenSquare className="mr-2 h-4 w-4" />
                    <span>Генератор контента</span>
                  </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                   <Link href="/translator">
                     <Languages className="mr-2 h-4 w-4" />
                     <span>Переводчик</span>
                   </Link>
                 </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer rounded-md text-destructive focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Выйти из системы</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (
             <div className="hidden md:flex items-center gap-3">
                <Button variant="ghost" asChild className="font-medium">
                  <Link href="/login">Вход</Link>
                </Button>
                <Button asChild className="font-bold shadow-lg shadow-primary/20">
                  <Link href="/register">Регистрация</Link>
                </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}