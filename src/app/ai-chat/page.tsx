
"use client";

import { useState, useRef, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, User, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiChat, type AIChatInput } from '@/ai/flows/ai-chat';
import { useData } from '@/hooks/use-data';
import type { Service } from '@/lib/types';
import Logo from '@/components/logo';

interface Message {
  role: 'user' | 'model';
  content: string;
}

// --- Reusable components for displaying AI responses ---

const TypingEffect = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (text.startsWith('SERVICE_CARD')) {
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
    }, 20);

    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return <ReactMarkdown className="prose prose-sm dark:prose-invert" remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>;
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
                    <span>{service.rating}</span>
                </div>
                <p className="text-base font-bold">${service.price}</p>
            </div>
        </div>
    </Link>
));
ServiceCardComponent.displayName = 'ServiceCardComponent';

const MessageContent = ({ content }: { content: string }) => {
    const { services } = useData();

    if (content.startsWith('SERVICE_CARD')) {
        const serviceId = content.match(/\[(.*?)\]/)?.[1];
        if (serviceId) {
            const service = services.find(s => s.id === serviceId);
            if (service) {
                return <ServiceCardComponent service={service} />;
            }
        }
    }
    
    return <ReactMarkdown className="prose prose-sm dark:prose-invert" remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
};

const ModelMessage = ({ content }: { content: string }) => {
    const [isTyping, setIsTyping] = useState(true);
    const parts = content.split(/(SERVICE_CARD\[.*?\])/g).filter(Boolean);

    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('SERVICE_CARD')) {
                    return <MessageContent key={index} content={part} />;
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
    { role: 'model', content: 'Здравствуйте! Как я могу помочь вам найти идеальную услугу на BizMart сегодня?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { services } = useData();

  const hasMessages = messages.length > 1;

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
    <div className="flex flex-col h-full">
        <ScrollArea className="flex-grow" viewportRef={scrollViewportRef}>
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
                        className={cn("flex items-start gap-4", msg.role === 'user' && 'justify-end')}
                    >
                    {msg.role === 'model' ? (
                        <>
                            <Avatar className="h-9 w-9 border-2 border-primary/50 shrink-0">
                                <AvatarFallback>
                                    <Sparkles className="h-5 w-5 text-primary"/>
                                </AvatarFallback>
                            </Avatar>
                            <div className="prose prose-sm dark:prose-invert bg-muted rounded-2xl px-4 py-3 break-words">
                                <ModelMessage content={msg.content} />
                            </div>
                        </>
                    ) : (
                        <div className="flex items-start gap-4">
                            <div className="prose prose-sm dark:prose-invert bg-primary text-primary-foreground px-4 py-3 rounded-2xl">
                                <p className="text-base">{msg.content}</p>
                            </div>
                            <Avatar className="h-9 w-9 border-2 border-muted shrink-0">
                                <AvatarFallback>
                                    <User className="h-5 w-5 text-muted-foreground"/>
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4">
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
        </ScrollArea>
        <div className="px-4 pb-4 w-full shrink-0">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSendMessage} className="relative">
                <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Спросите что-нибудь у AI Ассистента..."
                    className="w-full h-14 pl-4 pr-14 rounded-2xl shadow-lg border-border/20 text-base"
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg">
                    <Send className="h-5 w-5" />
                </Button>
                </form>
                <p className="text-xs text-center text-muted-foreground mt-2">AI может ошибаться. Проверяйте важную информацию.</p>
            </div>
        </div>
    </div>
  );
}
