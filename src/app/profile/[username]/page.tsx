

"use client";

import { Suspense, useState, useEffect, use } from 'react';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import ServiceCard from '@/components/service-card';
import ReviewCard from '@/components/review-card';
import CommentSection from '@/components/comment-section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, UserPlus, UserCheck, Edit, Grid3x3, MessageSquare, Video, ShoppingBag, UserRound, Package, Briefcase, Instagram, Linkedin, Globe, Mail, Phone, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/use-auth';
import type { User, Post, Order, UserStub, UserSocials, Conversation, Comment } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/hooks/use-data';

function PostInteraction({ post, onCommentClick }: { post: Post, onCommentClick: () => void }) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes ?? 0);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
    }
    
    const handleComment = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onCommentClick();
    }

    return (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
            <div className="flex flex-col items-center justify-center text-white text-center">
                <p className="text-sm mb-4 line-clamp-2">{post.caption}</p>
                <div className="flex items-center gap-6">
                    <button onClick={handleLike} className="flex items-center gap-1.5 transition-colors hover:text-rose-400">
                        <Heart className={liked ? "fill-current text-rose-500" : ""} />
                        <span className="font-semibold">{likeCount.toLocaleString()}</span>
                    </button>
                    <button onClick={handleComment} className="flex items-center gap-1.5 transition-colors hover:text-cyan-400">
                        <MessageCircle />
                        <span className="font-semibold">{post.comments?.length ?? 0}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function PostsGrid({ posts }: { posts: Post[] }) {
    const { addCommentToPost } = useData();
    const { user: authUser } = useAuth();

    if (!posts || posts.length === 0) {
        return (
            <div className="col-span-full text-center py-20 bg-card rounded-xl flex flex-col items-center justify-center">
                <Video className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2 font-headline">Пока нет постов</h3>
                <p className="text-muted-foreground mb-6">Этот пользователь еще не публиковал фото или видео.</p>
                <Button asChild>
                    <Link href="/dashboard/post/edit">Создать первый пост</Link>
                </Button>
            </div>
        )
    }

    const getYouTubeThumbnail = (url: string) => {
        const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;
        if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/0.jpg`;
        }
        return url; // Fallback to original url if not a youtube link
    };
    
    const handleAddComment = (postId: string, text: string) => {
        if (!authUser) return;
        const newComment: Comment = {
            id: `c-${Date.now()}`,
            author: { name: authUser.name, username: authUser.username, avatar: authUser.avatar },
            text,
            timestamp: 'Только что',
            likes: 0,
            dislikes: 0,
            replies: [],
        };
        addCommentToPost(postId, newComment);
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
            {posts.map(post => {
                const isVideo = post.type === 'video';
                const imageUrl = isVideo ? getYouTubeThumbnail(post.url) : post.url;

                return (
                    <Dialog key={post.id}>
                        <DialogTrigger asChild>
                            <div className="relative aspect-square group overflow-hidden rounded-lg cursor-pointer">
                                <Image
                                    src={imageUrl}
                                    alt={post.caption}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={post.type === 'photo' ? 'photo' : 'video'}
                                />
                                <PostInteraction post={post} onCommentClick={() => {}} />
                                {isVideo && (
                                    <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                                        <Video className="h-4 w-4 text-white" />
                                    </div>
                                )}
                            </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
                            <DialogHeader className="p-4 border-b">
                                <DialogTitle>Пост от {post.author?.name || 'пользователя'}</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 flex-grow overflow-hidden">
                                <div className="relative h-full w-full bg-black">
                                    <Image
                                        src={imageUrl}
                                        alt={post.caption}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex flex-col h-full">
                                    <div className="p-4 border-b">
                                        <p className="font-semibold">{post.author?.name}</p>
                                        <p className="text-sm text-muted-foreground">{post.caption}</p>
                                    </div>
                                    <div className="flex-grow overflow-y-auto">
                                        <CommentSection
                                            comments={post.comments}
                                            onAddComment={(text) => handleAddComment(post.id, text)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                );
            })}
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
                <Button asChild><Link href="/">Найти товары</Link></Button>
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
                <p className="text-muted-foreground mb-6">Приобретенные вами товары и услуги появятся здесь.</p>
                <Button asChild><Link href="/">Найти товары</Link></Button>
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
        <div className="flex items-center gap-4 mt-4">
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

function ProfilePageContent({ username }: { username: string }) {
  const { user: authUser } = useAuth();
  const { users, services: allServices, reviews: allReviewsData, conversations, addConversation } = useData();
  const router = useRouter();
  
  const user = users.find((u) => u.username === username);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(user?.followers || 0);
  const [formattedFollowerCount, setFormattedFollowerCount] = useState<string | number>(user?.followers || 0);

  useEffect(() => {
    if (user) {
        setFollowerCount(user.followers);
    }
  }, [user]);

  useEffect(() => {
    // Format the number on the client side to avoid hydration mismatch
    setFormattedFollowerCount(followerCount.toLocaleString('ru-RU'));
  }, [followerCount]);

  if (!user) {
    notFound();
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  const handleMessage = () => {
    if (!user) return;
    
    // Check if a conversation already exists
    const existingConversation = conversations.find(c => c.participant.username === user.username);
    
    if (existingConversation) {
        router.push(`/chat?new=${existingConversation.id}`);
        return;
    }

    // Create a new conversation
    const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        participant: {
            name: user.name,
            username: user.username,
            avatar: user.avatar,
        },
        lastMessage: "Начните беседу...",
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit'}),
        messages: []
    };

    addConversation(newConversation);
    router.push(`/chat?new=${newConversation.id}`);
  };

  const isOwnProfile = authUser?.username === user.username;

  const renderProviderProfile = (user: User) => {
    const userServices = allServices.filter(s => s.provider.username === user.username);
    const userReviews = allReviewsData.filter(r => user.reviews?.includes(r.id));
    
    const postsWithAuthor = user.posts?.map(p => ({...p, author: { name: user.name, username: user.username, avatar: user.avatar}})) || [];

    return (
        <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-[28rem] mx-auto">
              <TabsTrigger value="services"><Briefcase className="mr-2 h-4 w-4"/> Товары</TabsTrigger>
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
                        <h3 className="text-2xl font-semibold mb-2 font-headline">Пока нет товаров</h3>
                        <p className="text-muted-foreground mb-6">Этот исполнитель еще не разместил ни одного товара или услуги.</p>
                        {isOwnProfile && <Button asChild><Link href="/dashboard/service/edit">Добавить первый товар</Link></Button>}
                    </div>
                  )}
                </div>
            </TabsContent>
            <TabsContent value="posts" className="mt-8">
                <PostsGrid posts={postsWithAuthor} />
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
    <div className="container mx-auto max-w-6xl px-4 py-8">
       <Card className="p-6 mb-8 overflow-hidden">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 flex flex-col items-center text-center">
                 <Avatar className="h-32 w-32 border-4 border-background ring-4 ring-primary shrink-0">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="mt-4 flex items-center justify-center gap-6 w-full">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{formattedFollowerCount}</p>
                        <p className="text-sm text-muted-foreground">Подписчики</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold">{user.following?.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Подписки</p>
                    </div>
                </div>
              </div>

               <div className="md:col-span-3">
                    <div className="flex flex-col md:flex-row justify-between items-start">
                        <div>
                             <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
                             <p className="text-muted-foreground">@{user.username}</p>
                             <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{user.location}</span>
                            </div>
                        </div>
                         <div className="flex gap-2 mt-4 md:mt-0">
                            {isOwnProfile ? (
                                <Button variant="outline" asChild><Link href="/profile/edit"><Edit className="mr-2 h-4 w-4" /> Редактировать профиль</Link></Button>
                                ) : (
                                    <>
                                        <Button onClick={handleFollow} variant={isFollowing ? 'secondary' : 'default'} className="transition-colors">
                                            {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                            {isFollowing ? 'Вы подписаны' : 'Подписаться'}
                                        </Button>
                                        <Button variant="outline" onClick={handleMessage}><MessageSquare className="mr-2 h-4 w-4" /> Сообщение</Button>
                                    </>
                                )}
                        </div>
                    </div>
                    <p className="text-foreground/80 max-w-2xl mt-4">{user.bio}</p>
                    {user.socials && <SocialLinks socials={user.socials} />}
               </div>
           </div>
       </Card>
      
        {user.role === 'provider' ? renderProviderProfile(user) : renderCustomerProfile(user)}
    </div>
  );
}


export default function ProfilePage({ params }: { params: { username: string } }) {
    const { username } = use(params);
  
    return (
        <Suspense fallback={<div>Загрузка профиля...</div>}>
            <ProfilePageContent username={username} />
        </Suspense>
    );
}
