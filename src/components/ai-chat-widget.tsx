
"use client";

import { useState, useRef, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Sparkles, User, X, Star, Paperclip, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiChat } from '@/ai/flows/ai-chat';
import type { AIChatInput } from '@/ai/flows/ai-chat';
import { useData } from '@/hooks/use-data';
import type { Service, User as ProviderUser } from '@/lib/types';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface AIChatWidgetProps {
  onClose: () => void;
}

const AnimatedCard = ({ children }: { children: React.ReactNode }) => (
    <div className="animate-card-in opacity-0" style={{ animationFillMode: 'forwards' }}>
        {children}
    </div>
);

const TypingEffect = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
    useEffect(() => {
        if (text) {
            const timer = setTimeout(onComplete, text.length * 15 + 500); // Estimate completion time
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


const ServiceCard = memo(({ service }: { service: Service }) => (
    <Link href={`/services/${service.id}`} className="block bg-card hover:bg-background/80 rounded-lg overflow-hidden transition-all duration-300">
        <div className="relative h-32 w-full">
            <Image src={service.images[0]} alt={service.title} fill className="object-cover" />
        </div>
        <div className="p-3">
            <h4 className="font-semibold text-sm truncate">{service.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{service.rating.toFixed(1)}</span>
                </div>
                <p className="text-sm font-bold">{service.price} TJS</p>
            </div>
        </div>
    </Link>
));
ServiceCard.displayName = 'ServiceCard';

const ProviderCard = memo(({ provider }: { provider: ProviderUser }) => {
    const { services } = useData();
    const providerServices = services.filter(s => provider.services?.includes(s.id));
    const totalRating = providerServices.reduce((acc, service) => acc + (service?.rating ?? 0), 0);
    const avgRating = providerServices.length > 0 ? totalRating / providerServices.length : 0;

    return (
        <Link href={`/profile/${provider.username}`} className="block bg-card hover:bg-background/80 rounded-lg overflow-hidden transition-all duration-300 my-2 border">
            <div className="p-3 flex items-center gap-3">
                 <Avatar className="h-12 w-12">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <h4 className="font-semibold text-sm truncate">{provider.name}</h4>
                     <p className="text-xs text-muted-foreground line-clamp-1">{provider.bio}</p>
                    <div className="flex items-center gap-1 text-xs mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>{avgRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({provider.followers} подписчиков)</span>
                    </div>
                </div>
            </div>
        </Link>
    )
});
ProviderCard.displayName = 'ProviderCard';


const MessageContent = ({ content }: { content: string }) => {
    const { services, users } = useData();

    if (content.startsWith('SERVICE_CARD')) {
        const serviceId = content.match(/\[(.*?)\]/)?.[1];
        if (serviceId) {
            const service = services.find(s => s.id === serviceId);
            if (service) {
                return <AnimatedCard><ServiceCard service={service} /></AnimatedCard>;
            }
        }
    }

    if (content.startsWith('PROVIDER_CARD')) {
        const username = content.match(/\[(.*?)\]/)?.[1];
        if (username) {
            const provider = users.find(u => u.username === username);
            if (provider) {
                return <AnimatedCard><ProviderCard provider={provider} /></AnimatedCard>;
            }
        }
    }
    
    return <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-full" remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
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
                return <ReactMarkdown key={index} className="prose prose-sm dark:prose-invert max-w-full" remarkPlugins={[remarkGfm]}>{part}</ReactMarkdown>;
            })}
        </>
    );
};


export default function AIChatWidget({ onClose }: AIChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Здравствуйте! Чем я могу вам помочь сегодня? Я могу порекомендовать услуги или ответить на вопросы о нашей платформе.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { services, users } = useData();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

   useEffect(() => {
    setTimeout(scrollToBottom, 100);
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

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
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
            rating: s.rating
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
      setImagePreview(null);
      setImageDataUri(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      inputRef.current?.focus();
    }
  };

  return (
    <Card className="fixed bottom-20 right-5 w-96 h-[70vh] max-h-[700px] flex flex-col shadow-2xl rounded-2xl z-50 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b shrink-0">
            <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary"/>
                <CardTitle className="text-lg font-headline">AI Ассистент</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
            </Button>
        </CardHeader>
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-4">
                {messages.map((msg, index) => (
                    <div
                    key={index}
                    className={cn(
                        "flex items-start gap-3",
                        msg.role === 'user' && 'justify-end'
                    )}
                    >
                    {msg.role === 'model' && (
                        <Avatar className="h-8 w-8 border-2 border-primary/50">
                            <AvatarFallback><Sparkles className="h-4 w-4 text-primary"/></AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={cn(
                        "max-w-[80%] rounded-xl px-3 py-2 break-words",
                         msg.role === 'model'
                            ? "bg-muted rounded-bl-none"
                            : "bg-primary text-primary-foreground rounded-br-none"
                        )}
                    >
                       {msg.role === 'model' ? (
                            <ModelMessage content={msg.content} />
                        ) : (
                            <p className="text-sm">{msg.content}</p>
                        )}
                    </div>
                    {msg.role === 'user' && (
                        <Avatar className="h-8 w-8 border">
                            <AvatarFallback><User className="h-4 w-4 text-muted-foreground"/></AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 border-2 border-primary/50">
                            <AvatarFallback><Sparkles className="h-4 w-4 text-primary animate-pulse"/></AvatarFallback>
                        </Avatar>
                        <div className="max-w-xs rounded-xl px-3 py-2 bg-muted rounded-bl-none">
                            <p className="text-sm text-muted-foreground animate-pulse">Думаю...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <div className="p-3 border-t bg-background shrink-0">
             {imagePreview && (
                <div className="relative w-20 h-20 mb-2 rounded-md overflow-hidden">
                    <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-5 w-5"
                        onClick={() => {
                            setImagePreview(null);
                            setImageDataUri(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                    >
                        <X className="h-3 w-3" />
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
                        className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg z-20 text-muted-foreground"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Спросите что-нибудь..."
                        className="w-full h-12 pl-12 pr-12 rounded-lg border-2 input-element"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !imageDataUri)} className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 z-20">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    </Card>
  );
}
