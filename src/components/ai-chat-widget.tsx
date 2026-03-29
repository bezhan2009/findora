"use client";

import { useState, useRef, useEffect, memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUp, Sparkles, User, X, Star, Paperclip, Maximize2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiChat } from '@/ai/flows/ai-chat';
import { useData } from '@/hooks/use-data';
import type { Service, User as ProviderUser } from '@/lib/types';

interface Message {
  role: 'user' | 'model';
  content: string;
  photoDataUri?: string;
}

interface AIChatWidgetProps {
  onClose: () => void;
}

const AnimatedCard = ({ children }: { children: React.ReactNode }) => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-forwards">
        {children}
    </div>
);

const ServiceCard = memo(({ service }: { service: Service }) => (
    <Link href={`/services/${service.id}`} className="group block bg-card hover:bg-muted/50 rounded-xl overflow-hidden transition-all duration-300 border shadow-sm my-3 border-border/50">
        <div className="flex items-center p-3 gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                <Image 
                    src={service.images[0]} 
                    alt={service.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                />
            </div>
            <div className="flex-grow min-w-0">
                <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{service.title}</h4>
                <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>{service.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-[12px] font-black text-primary">{service.price} TJS</p>
                </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
    </Link>
));
ServiceCard.displayName = 'ServiceCard';

const ProviderCard = memo(({ provider }: { provider: ProviderUser }) => {
    return (
        <Link href={`/profile/${provider.username}`} className="group block bg-card hover:bg-muted/30 rounded-xl overflow-hidden transition-all duration-300 my-3 border shadow-sm border-border/50">
            <div className="p-3 flex items-center gap-3">
                 <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarImage src={provider.avatar} alt={provider.name} className="object-cover" />
                    <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{provider.name}</h4>
                    <div className="flex items-center gap-1 text-[10px] mt-1 text-primary font-bold">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>Топ исполнитель</span>
                    </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
        </Link>
    )
});
ProviderCard.displayName = 'ProviderCard';

const ImagePreviewSmall = ({ src }: { src: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden my-3 border shadow-sm cursor-zoom-in group min-h-[80px] bg-muted/10">
                    <img src={src} alt="Message image" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize2 className="h-5 w-5 text-white" />
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl border-none bg-transparent shadow-none p-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>Просмотр изображения</DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-[70vh]">
                    <img src={src} alt="Preview" className="w-full h-full object-contain" />
                </div>
            </DialogContent>
        </Dialog>
    );
};

const MessageContent = ({ content }: { content: string }) => {
    const { services, users } = useData();

    const parts = content.split(/(SERVICE_CARD\[.*?\]|PROVIDER_CARD\[.*?\])/g).filter(Boolean);

    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('SERVICE_CARD')) {
                    const id = part.match(/\[(.*?)\]/)?.[1];
                    const service = services.find(s => s.id === id);
                    return service ? <AnimatedCard key={index}><ServiceCard service={service} /></AnimatedCard> : null;
                }
                if (part.startsWith('PROVIDER_CARD')) {
                    const username = part.match(/\[(.*?)\]/)?.[1];
                    const provider = users.find(u => u.username === username);
                    return provider ? <AnimatedCard key={index}><ProviderCard provider={provider} /></AnimatedCard> : null;
                }

                let cleanedPart = part;
                if (index > 0 && parts[index-1].match(/(SERVICE_CARD|PROVIDER_CARD)/)) {
                    cleanedPart = cleanedPart.replace(/^[\s.,;:)\]!]+/, '');
                }

                return (
                    <div key={index} className="prose prose-sm dark:prose-invert max-w-full text-xs md:text-sm leading-relaxed mb-1">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanedPart}</ReactMarkdown>
                    </div>
                );
            })}
        </>
    );
};

export default function AIChatWidget({ onClose }: AIChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Здравствуйте! Чем я могу вам помочь сегодня? Я могу порекомендовать услуги или ответить на вопросы о платформе Findora.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { services, users } = useData();

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, []);

   useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const uri = e.target?.result as string;
            setImageDataUri(uri);
            setImagePreview(uri);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !imageDataUri) || isLoading) return;

    const userMessage: Message = { 
        role: 'user', 
        content: input,
        photoDataUri: imageDataUri || undefined
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const providers = users
        .filter(u => u.role === 'provider')
        .map(u => ({
            username: u.username,
            name: u.name,
            bio: u.bio,
            role: u.role,
            rating: 4.5,
        }));

      const result = await aiChat({
        history: messages.map(m => ({ role: m.role, content: m.content, photoDataUri: m.photoDataUri })),
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
      });
      
      setMessages(prev => [...prev, { role: 'model', content: result.response }]);

    } catch (error) {
      console.error("Ошибка AI чата:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Извините, возникла ошибка. Попробуйте еще раз." }]);
    } finally {
      setIsLoading(false);
      setImagePreview(null);
      setImageDataUri(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      inputRef.current?.focus();
    }
  };

  return (
    <Card className="fixed bottom-24 right-5 w-[380px] h-[70vh] max-h-[650px] flex flex-col shadow-2xl rounded-[2rem] z-[100] overflow-hidden border-2 border-primary/10 animate-in slide-in-from-bottom-10 duration-500 bg-background/95 backdrop-blur-lg">
        <CardHeader className="flex flex-row items-center justify-between p-5 border-b shrink-0 bg-background/50">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-2xl">
                    <Sparkles className="h-5 w-5 text-primary"/>
                </div>
                <CardTitle className="text-lg font-bold tracking-tight">Findora AI</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9 rounded-full hover:bg-muted">
                <X className="h-5 w-5" />
            </Button>
        </CardHeader>
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-muted/5 scroll-smooth">
            <div className="space-y-6">
                {messages.map((msg, index) => (
                    <div
                    key={index}
                    className={cn(
                        "flex items-start gap-3",
                        msg.role === 'user' && 'justify-end'
                    )}
                    >
                    {msg.role === 'model' && (
                        <Avatar className="h-8 w-8 border-2 border-primary/20 shadow-sm mt-0.5">
                            <AvatarFallback className="bg-primary/5 text-primary"><Sparkles className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={cn(
                        "max-w-[90%] rounded-2xl px-4 py-3 shadow-sm",
                         msg.role === 'model'
                            ? "bg-card border border-border/50 rounded-tl-none"
                            : "bg-primary text-primary-foreground rounded-tr-none shadow-md"
                        )}
                    >
                       {msg.photoDataUri && <ImagePreviewSmall src={msg.photoDataUri} />}
                       <MessageContent content={msg.content} />
                    </div>
                    {msg.role === 'user' && (
                        <Avatar className="h-8 w-8 border shadow-sm mt-0.5">
                            <AvatarImage src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=50&h=50&fit=crop" />
                            <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3 animate-in fade-in duration-300">
                        <Avatar className="h-8 w-8 border-2 border-primary/20">
                            <AvatarFallback className="bg-primary/5"><Sparkles className="h-5 w-5 text-primary animate-pulse"/></AvatarFallback>
                        </Avatar>
                        <div className="max-w-[100px] rounded-2xl px-4 py-3 bg-muted border border-border/50 rounded-tl-none">
                            <div className="flex gap-1.5">
                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <div className="p-4 border-t bg-background shrink-0">
             {imagePreview && (
                <div className="relative w-24 h-24 mb-3 rounded-2xl overflow-hidden border-2 border-primary shadow-xl animate-in zoom-in">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full shadow-lg"
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
                <div className="input-wrapper border shadow-sm">
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
                        className="absolute left-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl z-20 text-muted-foreground hover:bg-primary/5"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Спросите Findora..."
                        className="w-full h-11 pl-11 pr-11 rounded-2xl border-none shadow-none text-sm focus-visible:ring-0 bg-transparent text-foreground relative z-10"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !imageDataUri)} className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full shadow-lg z-20 bg-primary hover:bg-primary/90">
                        <ArrowUp className="h-5 w-5 text-white" />
                    </Button>
                </div>
            </form>
        </div>
    </Card>
  );
}
