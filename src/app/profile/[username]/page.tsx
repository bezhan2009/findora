"use client";

import { use, Suspense, useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { users, services as allServices, reviews as allReviewsData } from '@/lib/data';
import ServiceCard from '@/components/service-card';
import ReviewCard from '@/components/review-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, UserPlus, UserCheck, Edit, Grid3x3, MessageSquare, Video, ShoppingBag, UserRound, Package, Briefcase, Instagram, Linkedin, Globe, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/use-auth';
import type { User, Post, Order, UserStub, UserSocials } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

function PostsGrid({ posts }: { posts: Post[] }) {
    if (!posts || posts.length === 0) {
        return (
            <div className="col-span-full text-center py-20 bg-card rounded-xl flex flex-col items-center justify-center">
                <Video className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2 font-headline">Пока нет постов</h3>
                <p className="text-muted-foreground mb-6">Этот пользователь еще не публиковал фото или видео.</p>
                <Button>Создать первый пост</Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
            {posts.map(post => (
                <div key={post.id} className="relative aspect-square group overflow-hidden rounded-lg">
                    <Image
                        src={post.url}
                        alt={post.caption}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={post.type === 'photo' ? 'photo' : 'video'}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                        <p className="text-white text-center text-sm">{post.caption}</p>
                    </div>
                    {post.type === 'video' && <Video className="absolute top-2 right-2 h-6 w-6 text-white drop-shadow-lg" />}
                </div>
            ))}
        </div>
    )
}

function FollowingList({ following }: { following: UserStub[] }) {
    if (!following || following.length === 0) {
        return (
            <div className="col-span-full text-center py-20 bg-card rounded-xl flex flex-col items-center justify-center">
                <UserRound className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2 font-headline">Нет подписок</h3>
                <p className="text-muted-foreground mb-6">Подпишитесь на исполнителей, чтобы видеть их обновления здесь.</p>
                <Button asChild><Link href="/">Найти услуги</Link></Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {following.map(user => (
                <Card key={user.username}>
                    <CardContent className="p-4 flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                        <Button asChild variant="outline" className="ml-auto">
                            <Link href={`/profile/${user.username}`}>Профиль</Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function OrdersList({ orders }: { orders: Order[] }) {
    if (!orders || orders.length === 0) {
        return (
            <div className="col-span-full text-center py-20 bg-card rounded-xl flex flex-col items-center justify-center">
                <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2 font-headline">Пока нет заказов</h3>
                <p className="text-muted-foreground mb-6">Приобретенные вами услуги появятся здесь.</p>
                <Button asChild><Link href="/">Найти услуги</Link></Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {orders.map(order => (
                <Card key={order.id}>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 items-start md:items-center gap-4">
                        <div className="md:col-span-1">
                            <p className="font-semibold">{order.serviceTitle}</p>
                            <p className="text-sm text-muted-foreground">у <Link href={`/profile/${order.providerUsername}`} className="text-primary hover:underline">{order.providerName}</Link></p>
                        </div>
                        <div className="md:col-span-1 flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{new Date(order.date).toLocaleDateString()}</span>
                            <span>|</span>
                            <span>${order.price}</span>
                        </div>
                        <div className="md:col-span-1 flex justify-start md:justify-end">
                             <Badge variant={order.status === 'Completed' ? 'default' : (order.status === 'In Progress' ? 'secondary' : 'outline')}>{order.status === 'Completed' ? 'Завершено' : (order.status === 'In Progress' ? 'В процессе' : 'Отменено')}</Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function SocialLinks({ socials }: { socials: UserSocials }) {
    const hasSocials = Object.values(socials).some(link => !!link);

    if (!hasSocials) {
        return null;
    }

    return (
        <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
            {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <Instagram className="h-5 w-5" />
                </a>
            )}
             {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <Linkedin className="h-5 w-5" />
                </a>
            )}
            {socials.website && (
                <a href={socials.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <Globe className="h-5 w-5" />
                </a>
            )}
            {socials.email && (
                <a href={`mailto:${socials.email}`} className="text-muted-foreground hover:text-primary">
                    <Mail className="h-5 w-5" />
                </a>
            )}
            {socials.phone && (
                <a href={`tel:${socials.phone}`} className="text-muted-foreground hover:text-primary">
                    <Phone className="h-5 w-5" />
                </a>
            )}
        </div>
    )
}

function ProfilePageContent({ params }: { params: { username: string } }) {
  const { user: authUser } = useAuth();
  const { username } = params;
  const user = users.find((u) => u.username === username);

  if (!user) {
    notFound();
  }
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(user.followers);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  const isOwnProfile = authUser?.username === user.username;

  const renderProviderProfile = (user: User) => {
    const userServices = allServices.filter(s => s.provider.username === user.username);
    const userReviews = allReviewsData.filter(r => r.providerId === user.id);
    
    return (
        <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-[28rem] mx-auto">
              <TabsTrigger value="services"><Briefcase className="mr-2 h-4 w-4"/> Услуги</TabsTrigger>
              <TabsTrigger value="posts"><Grid3x3 className="mr-2 h-4 w-4"/> Посты</TabsTrigger>
              <TabsTrigger value="reviews"><MessageSquare className="mr-2 h-4 w-4"/> Отзывы</TabsTrigger>
            </TabsList>
            <TabsContent value="services" className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {userServices.length > 0 ? (
                    userServices.map(service => <ServiceCard key={service.id} service={service} />)
                  ) : (
                    <div className="col-span-full text-center py-20 bg-card rounded-xl flex flex-col items-center justify-center">
                        <Briefcase className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2 font-headline">Пока нет услуг</h3>
                        <p className="text-muted-foreground mb-6">Этот исполнитель еще не разместил ни одной услуги.</p>
                        {isOwnProfile && <Button>Добавить первую услугу</Button>}
                    </div>
                  )}
                </div>
            </TabsContent>
            <TabsContent value="posts" className="mt-8">
                <PostsGrid posts={user.posts || []} />
            </TabsContent>
            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-6">
                {userReviews.length > 0 ? (
                  userReviews.map(review => <ReviewCard key={review.id} review={review} />)
                ) : (
                    <div className="col-span-full text-center py-20 bg-card rounded-xl flex flex-col items-center justify-center">
                        <MessageSquare className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2 font-headline">Пока нет отзывов</h3>
                        <p className="text-muted-foreground">У этого исполнителя еще нет отзывов.</p>
                    </div>
                )}
              </div>
            </TabsContent>
        </Tabs>
    );
  }

  const renderCustomerProfile = (user: User) => {
    return (
        <Tabs defaultValue="following" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-96 mx-auto">
              <TabsTrigger value="following"><UserRound className="mr-2 h-4 w-4"/> Подписки ({user.following?.length || 0})</TabsTrigger>
              <TabsTrigger value="orders"><ShoppingBag className="mr-2 h-4 w-4"/> Мои заказы ({user.orders?.length || 0})</TabsTrigger>
            </TabsList>
            <TabsContent value="following" className="mt-8">
                <FollowingList following={user.following || []} />
            </TabsContent>
            <TabsContent value="orders" className="mt-8">
                <OrdersList orders={user.orders || []} />
            </TabsContent>
        </Tabs>
    )
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <header className="relative mb-12">
        <div className="w-full h-48 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl"/>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 flex flex-col items-center w-full px-4">
            <Avatar className="h-32 w-32 border-4 border-background ring-4 ring-primary shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-4 text-center">
                <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
            </div>
        </div>
      </header>
      
      <main className="pt-20">
        <Card className="p-6 mb-8">
           <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                <div className="flex-grow">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                    </div>
                    <p className="text-foreground/80 max-w-2xl mx-auto md:mx-0">{user.bio}</p>
                    {user.socials && <SocialLinks socials={user.socials} />}
                </div>

                <div className="flex items-center justify-center md:justify-end gap-6 w-full md:w-auto shrink-0">
                    {user.role === 'provider' && (
                        <div className="text-center">
                            <p className="text-2xl font-bold">{allServices.filter(s => s.provider.username === user.username).length}</p>
                            <p className="text-sm text-muted-foreground">Услуги</p>
                        </div>
                    )}
                    <div className="text-center">
                        <p className="text-2xl font-bold">{followerCount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Подписчики</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold">{user.following?.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Подписки</p>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-center md:justify-end gap-2">
               {isOwnProfile ? (
                    <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Редактировать профиль</Button>
                ) : (
                    <>
                        <Button onClick={handleFollow} variant={isFollowing ? 'secondary' : 'default'} className="transition-colors">
                            {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                            {isFollowing ? 'Вы подписаны' : 'Подписаться'}
                        </Button>
                        <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" /> Сообщение</Button>
                    </>
                )}
            </div>
        </Card>
      
        {user.role === 'provider' ? renderProviderProfile(user) : renderCustomerProfile(user)}
      </main>
    </div>
  );
}


export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <Suspense fallback={<div>Загрузка профиля...</div>}>
      <ProfilePageContent params={resolvedParams} />
    </Suspense>
  );
}
