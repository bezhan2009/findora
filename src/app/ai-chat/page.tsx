
"use client";

import { useState, useRef, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, User, Star, Paperclip, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiChat, type AIChatInput } from '@/ai/flows/ai-chat';
import { useData } from '@/hooks/use-data';
import type { Service, User as ProviderUser } from '@/lib/types';
import Logo from '@/components/logo';

interface Message {
  role: 'user' | 'model';
  content: string;
  photoDataUri?: string;
}

const AnimatedCard = ({ children }: { children: React.ReactNode }) => (
    <div className="animate-card-in" style={{ animationFillMode: 'forwards' }}>
        {children}
    </div>
);

const TypingEffect = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
    useEffect(() => {
        if (text) {
            const timer = setTimeout(onComplete, text.length * 15 + 500); 
            return () => clearTimeout(timer);
        }
    }, [text, onComplete]);

    if (text.startsWith('SERVICE_CARD') || text.startsWith('PROVIDER_CARD')) {
        return <MessageContent content={text} />;
    }

    const letters = text.split('');

    return (
        <div className="prose prose-sm dark:prose-invert leading-relaxed typing-animation-container">
            {letters.map((letter, index) => (
                <span
                    key={index}
                    className="animate-letter"
                    style={{ animationDelay: `${index * 0.015}s` }}
                >
                    {letter}
                </span>
            ))}
        </div>
    );
};


const ServiceCardComponent = memo(({ service }: { service: Service }) => (
    <Link href={`/services/${service.id}`} className="block bg-card hover:bg-background/80 rounded-lg overflow-hidden transition-all duration-300 my-2 border">
        <div className="relative h-40 w-full">
            <Image src={service.images[0]} alt={service.title} fill className="object-cover" />
        </div>
        <div className="p-3">
            <h4 className="font-semibold text-base truncate">{service.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{service.rating.toFixed(1)}</span>
                </div>
                <p className="text-base font-bold">{service.price} TJS</p>
            </div>
        </div>
    </Link>
));
ServiceCardComponent.displayName = 'ServiceCardComponent';

const ProviderCardComponent = memo(({ provider }: { provider: ProviderUser }) => {
    const { services } = useData();
    const providerServices = services.filter(s => provider.services?.includes(s.id));
    const totalRating = providerServices.reduce((acc, service) => acc + (service?.rating ?? 0), 0);
    const avgRating = providerServices.length > 0 ? totalRating / providerServices.length : 0;

    return (
        <Link href={`/profile/${provider.username}`} className="block bg-card hover:bg-background/80 rounded-lg overflow-hidden transition-all duration-300 my-2 border">
            <div className="p-4 flex items-center gap-4">
                 <Avatar className="h-16 w-16">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <h4 className="font-semibold text-base truncate">{provider.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{provider.bio}</p>
                    <div className="flex items-center gap-1 text-sm mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{avgRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({provider.followers} подписчиков)</span>
                    </div>
                </div>
            </div>
        </Link>
    )
});
ProviderCardComponent.displayName = 'ProviderCardComponent';

const MessageContent = ({ content }: { content: string }) => {
    const { services, users } = useData();

    if (content.startsWith('SERVICE_CARD')) {
        const serviceId = content.match(/\[(.*?)\]/)?.[1];
        if (serviceId) {
            const service = services.find(s => s.id === serviceId);
            if (service) {
                return <AnimatedCard><ServiceCardComponent service={service} /></AnimatedCard>;
            }
        }
    }
    
    if (content.startsWith('PROVIDER_CARD')) {
        const username = content.match(/\[(.*?)\]/)?.[1];
        if (username) {
            const provider = users.find(u => u.username === username);
            if (provider) {
                return <AnimatedCard><ProviderCardComponent provider={provider} /></AnimatedCard>;
            }
        }
    }
    
    return <ReactMarkdown className="prose prose-sm dark:prose-invert" remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
};

const ModelMessage = ({ content }: { content: string }) => {
    const [isTyping, setIsTyping] = useState(true);
    const parts = content.split(/(SERVICE_CARD\[.*?\]|PROVIDER_CARD\[.*?\])/g).filter(Boolean);

    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('SERVICE_CARD') || part.startsWith('PROVIDER_CARD')) {
                    return <AnimatedCard key={index}><MessageContent content={part} /></AnimatedCard>;
                }
                if (isTyping && index === parts.length - 1) {
                    return <TypingEffect key={index} text={part} onComplete={() => setIsTyping(false)} />;
                }
                return <ReactMarkdown key={index} className="prose prose-sm dark:prose-invert" remarkPlugins={[remarkGfm]}>{part}</ReactMarkdown>;
            })}
        </>
    );
};


export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Здравствуйте! Как я могу помочь вам найти идеальную услугу на BizMart сегодня? Вы также можете загрузить изображение.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { services, users } = useData();
  const hasMessages = messages.length > 1;

  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior,
        });
    }
  };
  
  const handleScroll = () => {
    if (scrollAreaRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
        // Show button if user has scrolled up significantly
        setShowScrollDown(scrollHeight - scrollTop > clientHeight + 100);
    }
  };

  useEffect(() => {
    const scrollDiv = scrollAreaRef.current;
    if (scrollDiv) {
        scrollDiv.addEventListener('scroll', handleScroll);
        return () => scrollDiv.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => scrollToBottom('auto'), 100);
    }
  }, [messages, isLoading]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const uri = e.target?.result as string;
            setImageDataUri(uri);
            setImagePreview(URL.createObjectURL(file));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !imageDataUri) || isLoading) return;

    const userMessage: Message = { role: 'user', content: input, photoDataUri: imageDataUri || undefined };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setImagePreview(null);
    setImageDataUri(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setIsLoading(true);

    try {
      const providers = users
        .filter(u => u.role === 'provider')
        .map(u => {
            const providerServices = services.filter(s => u.services?.includes(s.id));
            const totalRating = providerServices.reduce((acc, service) => acc + (service?.rating ?? 0), 0);
            const avgRating = providerServices.length > 0 ? totalRating / providerServices.length : 0;
            return {
                username: u.username,
                name: u.name,
                bio: u.bio,
                role: u.role,
                rating: avgRating,
            }
        });

      const chatRequest: AIChatInput = {
        history: messages,
        message: input,
        services: services.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            price: s.price,
            category: s.category,
            rating: s.rating,
        })),
        providers,
        photoDataUri: imageDataUri || undefined,
      };
      
      const result = await aiChat(chatRequest);
      
      const modelMessage: Message = { role: 'model', content: result.response };
      setMessages(prev => [...prev, modelMessage]);

    } catch (error) {
      console.error("Ошибка AI чата:", error);
      const errorMessage: Message = { role: 'model', content: "Извините, что-то пошло не так. Пожалуйста, попробуйте еще раз." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
        <div 
            ref={scrollAreaRef}
            className="flex-1 overflow-y-auto custom-scrollbar relative"
        >
            <div className={cn("max-w-3xl mx-auto px-4 pt-8 pb-4", hasMessages ? "w-full" : "flex flex-col justify-center h-full")}>
              {!hasMessages && (
                  <div className="text-center mb-16">
                      <Logo />
                  </div>
              )}
                <div className="space-y-8">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex items-start gap-4 animate-card-in", 
                            msg.role === 'user' ? 'justify-end' : ''
                        )}
                    >
                    {msg.role === 'model' ? (
                        <>
                            <Avatar className="h-9 w-9 border-2 border-primary/50 shrink-0">
                                <AvatarFallback>
                                    <Sparkles className="h-5 w-5 text-primary"/>
                                </AvatarFallback>
                            </Avatar>
                            <div className="prose prose-sm dark:prose-invert bg-muted rounded-2xl px-4 py-3 break-words max-w-[80%]">
                                <ModelMessage content={msg.content} />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-end max-w-[80%]">
                            {msg.photoDataUri && (
                                <div className="relative w-full max-w-sm aspect-video rounded-md overflow-hidden mb-2">
                                <Image src={msg.photoDataUri} alt="User upload" layout="fill" className="object-contain" />
                                </div>
                            )}
                             {msg.content && (
                                <div className="prose prose-sm dark:prose-invert bg-primary text-primary-foreground px-4 py-3 rounded-2xl">
                                    <p className="text-base">{msg.content}</p>
                                </div>
                             )}
                        </div>
                    )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4 animate-card-in">
                        <Avatar className="h-9 w-9 border-2 border-primary/50 shrink-0">
                            <AvatarFallback>
                                <Sparkles className="h-5 w-5 text-primary animate-pulse"/>
                            </AvatarFallback>
                        </Avatar>
                        <div className="max-w-md rounded-2xl px-4 py-3 bg-muted">
                            <p className="text-sm text-muted-foreground animate-pulse">Думаю...</p>
                        </div>
                    </div>
                )}
                </div>
            </div>
             {showScrollDown && (
                <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute bottom-4 right-8 rounded-full h-10 w-10 shadow-lg"
                    onClick={() => scrollToBottom()}
                >
                    <ChevronDown className="h-6 w-6" />
                </Button>
            )}
        </div>
        <div className="px-4 pb-4 w-full shrink-0 border-t bg-background">
            <div className="max-w-3xl mx-auto pt-4">
                {imagePreview && (
                    <div className="relative w-24 h-24 mb-2 rounded-md overflow-hidden">
                        <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => {
                                setImagePreview(null);
                                setImageDataUri(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="relative">
                    <div className="input-wrapper">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg z-20 text-muted-foreground"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Спросите что-нибудь у AI Ассистента..."
                            className="w-full h-14 pl-14 pr-14 rounded-xl shadow-none border-2 text-base z-10 input-element"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !imageDataUri)} className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg z-20">
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </form>
                <p className="text-xs text-center text-muted-foreground mt-2">AI может ошибаться. Проверяйте важную информацию.</p>
            </div>
        </div>
    </div>
  );
}
