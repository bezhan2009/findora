
"use client";

import { useState, useRef, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Sparkles, User, X, Star } from 'lucide-react';
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

const TypingEffect = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (text.startsWith('SERVICE_CARD') || text.startsWith('PROVIDER_CARD')) {
        setDisplayedText(text);
        onComplete();
        return;
    }

    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i > text.length) {
        clearInterval(intervalId);
        onComplete();
      }
    }, 10); // Speed up typing animation

    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-full">
       <div style={{ display: 'inline-block' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>
       </div>
      <span className="typing-cursor"></span>
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
                <p className="text-sm font-bold">${service.price}</p>
            </div>
        </div>
    </Link>
));
ServiceCard.displayName = 'ServiceCard';

const ProviderCard = memo(({ provider }: { provider: ProviderUser }) => {
    const totalRating = (provider.services ?? [])
        .map(serviceId => useData().services.find(s => s.id === serviceId))
        .filter(Boolean)
        .reduce((acc, service) => acc + (service?.rating ?? 0), 0);
    const avgRating = (provider.services?.length ?? 0) > 0 ? totalRating / (provider.services?.length ?? 1) : 0;

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
                return <ServiceCard service={service} />;
            }
        }
    }

    if (content.startsWith('PROVIDER_CARD')) {
        const username = content.match(/\[(.*?)\]/)?.[1];
        if (username) {
            const provider = users.find(u => u.username === username);
            if (provider) {
                return <ProviderCard provider={provider} />;
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
                    return <MessageContent key={index} content={part} />;
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
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { services, users } = useData();


  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  };

   useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const providers = users
        .filter(u => u.role === 'provider')
        .map(u => {
            const totalRating = (u.services ?? [])
                .map(serviceId => services.find(s => s.id === serviceId))
                .filter(Boolean)
                .reduce((acc, service) => acc + (service?.rating ?? 0), 0);
            const avgRating = (u.services?.length ?? 0) > 0 ? totalRating / (u.services?.length ?? 1) : 0;
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
            category: s.category
        })),
        providers,
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
    <Card className="fixed bottom-20 right-5 w-96 h-[60vh] flex flex-col shadow-2xl rounded-2xl z-50">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary"/>
                <CardTitle className="text-lg font-headline">AI Ассистент</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
            </Button>
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
             <ScrollArea className="flex-grow p-4" viewportRef={scrollViewportRef}>
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
                            "max-w-xs rounded-xl px-3 py-2 break-words",
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
            </ScrollArea>
            <div className="p-3 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Спросите что-нибудь..."
                    className="flex-grow"
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                </Button>
                </form>
            </div>
        </CardContent>
    </Card>
  );
}

    