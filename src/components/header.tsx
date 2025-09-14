
"use client";

import Link from 'next/link';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, User, Heart, MessageSquare, LogOut, LogIn, LayoutDashboard, Bell, Sparkles, Languages, ShoppingCart } from 'lucide-react';
import Logo from './logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { ThemeToggle } from './theme-toggle';
import SearchBar from './search-bar';
import { useCart } from '@/hooks/use-cart';
import { Badge } from './ui/badge';


const navLinks = [
  { href: '/favorites', label: 'Favorites', icon: Heart, roles: ['customer', 'provider'] },
  { href: '/chat', label: 'Messages', icon: MessageSquare, roles: ['customer', 'provider'] },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['provider'] },
];

export default function Header() {
  const { user, logout, role } = useAuth();
  const { cartCount } = useCart();

  const getNavLinks = () => {
      if (!user) return [];
      return navLinks.filter(link => link.roles.includes(role || 'customer'));
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="hidden md:block">
            <Logo />
          </div>
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 p-4">
                <Logo />
                <nav className="flex flex-col gap-4">
                  <Link href="/" className="flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground">Home</Link>
                  {getNavLinks().map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </Link>
                  ))}
                   {!user && (
                     <>
                      <Link href="/login" className="flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground">
                        <LogIn className="h-5 w-5" />
                        Log In
                      </Link>
                      <Link href="/register" className="flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground">
                        <User className="h-5 w-5" />
                        Sign Up
                      </Link>
                     </>
                   )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          {/* Desktop Nav */}
          <nav className="hidden items-center gap-4 md:flex">
             <Link
                href="/"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Home
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
        
        <div className="flex-1 mx-4 md:mx-8 max-w-md">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
           <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                   <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 min-w-0 p-0 flex items-center justify-center text-xs">
                    {cartCount > 9 ? '9+' : cartCount}
                  </Badge>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Link>
            </Button>
          {user ? (
            <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-0 -right-0 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" />
                    <AvatarFallback>DP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">New Order!</p>
                    <p className="text-xs text-muted-foreground">Diana Prince just ordered "Custom Website Development".</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-3">
                    <div className="w-8 h-8 flex items-center justify-center mt-1">
                        <Heart className="h-5 w-5 text-rose-500" />
                    </div>
                  <div>
                    <p className="text-sm font-medium">New Like</p>
                    <p className="text-xs text-muted-foreground">Someone liked your service "E-commerce Store Setup".</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">@{user.username}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.username}`}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                 {getNavLinks().map((link) => (
                   <DropdownMenuItem key={link.href} asChild>
                     <Link href={link.href}>
                       <link.icon className="mr-2 h-4 w-4" />
                       <span>{link.label}</span>
                     </Link>
                   </DropdownMenuItem>
                 ))}
                 <DropdownMenuItem asChild>
                   <Link href="/ai-chat">
                     <Sparkles className="mr-2 h-4 w-4" />
                     <span>AI Assistant</span>
                   </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                   <Link href="/translator">
                     <Languages className="mr-2 h-4 w-4" />
                     <span>Translator</span>
                   </Link>
                 </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (
             <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
