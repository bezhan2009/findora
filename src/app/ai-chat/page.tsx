"use client";

import { useState, useRef, useEffect, memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUp, Sparkles, User, Star, Paperclip, X, Quote, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiChat, type AIChatInput } from '@/ai/flows/ai-chat';
import { useData } from '@/hooks/use-data';
import type { Service, User as ProviderUser } from '@/lib/types';
import ScrollToBottomButton from '@/components/scroll-to-bottom-button';

interface Message {
  role: 'user' | 'model';
  content: string;
  photoDataUri?: string;
  quote?: string;
}

const AnimatedCard = ({ children }: { children: React.ReactNode }) => (
    <div className="animate-card-in" style={{ animationFillMode: 'forwards' }}>
        {children}
    </div>
);

const ServiceCardComponent = memo(({ service }: { service: Service }) => (
    <Link href={`/services/${service.id}`} className="group block bg-card hover:bg-muted/30 rounded-2xl overflow-hidden transition-all duration-300 my-6 border shadow-lg hover:shadow-xl hover:-translate-y-1">
        <div className="relative h-56 w-full overflow-hidden">
            <Image 
                src={service.images[0]} 
                alt={service.title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md px-2 py-1 rounded-lg text-sm font-bold text-primary shadow-sm">
                {service.price} TJS
            </div>
        </div>
        <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{service.category}</span>
            </div>
            <h4 className="font-bold text-xl truncate group-hover:text-primary transition-colors">{service.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">{service.description}</p>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                    </div>
                    <span className="font-bold">{service.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground font-medium">({service.reviewsCount} отзывов)</span>
                </div>
                <Button variant="ghost" size="sm" className="rounded-full text-primary font-bold group-hover:bg-primary/10">
                    Подробнее
                </Button>
            </div>
        </div>
    </Link>
));
ServiceCardComponent.displayName = 'ServiceCardComponent';

const ProviderCardComponent = memo(({ provider }: { provider: ProviderUser }) => {
    return (
        <Link href={`/profile/${provider.username}`} className="group block bg-card hover:bg-muted/30 rounded-2xl overflow-hidden transition-all duration-300 my-6 border shadow-lg hover:shadow-xl">
            <div className="p-6 flex items-center gap-5">
                 <div className="relative">
                    <Avatar className="h-20 w-20 border-2 border-primary/20 p-1 bg-background transition-transform duration-300 group-hover:scale-105">
                        <AvatarImage src={provider.avatar} alt={provider.name} className="rounded-full object-cover" />
                        <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-background">
                        <Sparkles className="h-3 w-3" />
                    </div>
                 </div>
                <div className="flex-grow">
                    <h4 className="font-bold text-xl truncate group-hover:text-primary transition-colors">{provider.name}</h4>
                    <p className="text-sm text-muted-foreground">@{provider.username}</p>
                    <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/5 px-2 py-1 rounded-md">
                            <Star className="h-3 w-3 fill-current" />
                            <span>Проверен</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">Топ исполнитель</span>
                    </div>
                </div>
            </div>
        </Link>
    )
});
ProviderCardComponent.displayName = 'ProviderCardComponent';

const ImagePreview = ({ src, alt }: { src: string; alt: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative group cursor-zoom-in mt-2 mb-4 overflow-hidden rounded-2xl border shadow-md transition-all hover:shadow-xl hover:ring-4 hover:ring-primary/10 bg-muted/20 min-h-[100px] flex items-center justify-center">
                    <img 
                        src={src} 
                        alt={alt} 
                        className="max-w-full h-auto max-h-[400px] object-contain rounded-2xl mx-auto transition-transform duration-500 group-hover:scale-[1.02]" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="bg-background/80 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shadow-lg">
                            <Maximize2 className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] md:max-w-5xl border-none bg-black/95 shadow-none p-0 flex items-center justify-center rounded-none sm:rounded-none">
                <DialogHeader className="sr-only">
                    <DialogTitle>Просмотр изображения</DialogTitle>
                </DialogHeader>
                <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain" />
            </DialogContent>
        </Dialog>
    );
};

const MessageContent = ({ content }: { content: string }) => {
    const { services, users } = useData();

    const parts = content.split(/(SERVICE_CARD\[.*?\]|PROVIDER_CARD\[.*?\])/g).filter(Boolean);

    return (
        <div className="relative group">
            {parts.map((part, index) => {
                if (part.startsWith('SERVICE_CARD')) {
                    const id = part.match(/\[(.*?)\]/)?.[1];
                    const service = services.find(s => s.id === id);
                    return service ? <AnimatedCard key={index}><ServiceCardComponent service={service} /></AnimatedCard> : null;
                }
                if (part.startsWith('PROVIDER_CARD')) {
                    const username = part.match(/\[(.*?)\]/)?.[1];
                    const provider = users.find(u => u.username === username);
                    return provider ? <AnimatedCard key={index}><ProviderCardComponent provider={provider} /></AnimatedCard> : null;
                }
                return (
                    <div key={index} className="relative select-text">
                        <ReactMarkdown 
                            className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-base" 
                            remarkPlugins={[remarkGfm]}
                        >
                            {part}
                        </ReactMarkdown>
                    </div>
                );
            })}
        </div>
    );
};

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Привет! Я — ИИ ассистент Findora. Чем могу помочь? Могу найти услуги, сравнить исполнителей или проанализировать ваше фото.' }
  ]);
  const [input, setInput] = useState('');
  const [quotedText, setQuotedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  
  const [selection, setSelection] = useState<{ text: string, x: number, y: number } | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { services, users } = useData();

  const handleQuote = useCallback((text: string) => {
      setQuotedText(text.length > 150 ? text.substring(0, 150) + '...' : text);
      setSelection(null);
      inputRef.current?.focus();
  }, []);

  const handleMouseUp = (e: React.MouseEvent) => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (text && text.length > 2) {
          const range = sel?.getRangeAt(0);
          const rect = range?.getBoundingClientRect();
          if (rect) {
              setSelection({
                  text,
                  x: rect.left + rect.width / 2,
                  y: rect.top - 40
              });
          }
      } else {
          setSelection(null);
      }
  };

  useEffect(() => {
      const handleGlobalClick = () => {
          if (!window.getSelection()?.toString().trim()) {
              setSelection(null);
          }
      };
      document.addEventListener('mousedown', handleGlobalClick);
      return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        if (file.size > 10 * 1024 * 1024) {
            alert("Файл слишком большой. Максимальный размер 10МБ.");
            return;
        }
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

    const fullMessage = quotedText ? `> ${quotedText}\n\n${input}` : input;
    const currentPhoto = imageDataUri; 
    
    const userMessage: Message = { 
        role: 'user', 
        content: fullMessage, 
        photoDataUri: currentPhoto || undefined,
        quote: quotedText || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setQuotedText(null);
    setImagePreview(null);
    setImageDataUri(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
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
        message: fullMessage,
        services: services.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            price: s.price,
            category: s.category,
            rating: s.rating,
        })),
        providers,
        photoDataUri: currentPhoto || undefined,
      });
      
      setMessages(prev => [...prev, { role: 'model', content: result.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Произошла ошибка при получении ответа от ИИ. Попробуйте еще раз." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background font-body">
        {selection && (
            <div 
                className="fixed z-[100] animate-in fade-in zoom-in duration-200"
                style={{ left: selection.x, top: selection.y, transform: 'translateX(-50%)' }}
            >
                <Button 
                    size="sm" 
                    className="shadow-xl rounded-full bg-primary hover:bg-primary/90 flex items-center gap-2 px-4 h-9 font-bold"
                    onClick={() => handleQuote(selection.text)}
                >
                    <Sparkles className="h-4 w-4" />
                    <span>Спросить Findora</span>
                </Button>
            </div>
        )}

        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto custom-scrollbar relative" onMouseUp={handleMouseUp}>
            <div className={cn("max-w-3xl mx-auto px-4 pt-12 pb-20", messages.length > 1 ? "w-full" : "flex flex-col justify-center h-full")}>
              {messages.length <= 1 && (
                  <div className="text-center mb-12 animate-in fade-in zoom-in duration-700">
                      <div className="flex justify-center mb-6">
                        <div className="p-4 bg-primary/10 rounded-3xl">
                            <Sparkles className="h-12 w-12 text-primary" />
                        </div>
                      </div>
                      <h1 className="text-4xl font-bold font-headline mb-4 tracking-tight">Как я могу помочь?</h1>
                      <p className="text-muted-foreground text-lg max-w-md mx-auto">Найду исполнителя, подскажу цену или подберу товар по фото.</p>
                  </div>
              )}
                <div className="space-y-12">
                {messages.map((msg, index) => (
                    <div key={index} className={cn("flex items-start gap-5", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'model' && (
                            <Avatar className="h-10 w-10 border-2 border-primary/20 shrink-0 shadow-sm">
                                <AvatarFallback className="bg-primary/5 text-primary"><Sparkles className="h-6 w-6"/></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn(
                            "max-w-[85%] group",
                            msg.role === 'user' ? 'flex flex-col items-end' : 'bg-muted/30 rounded-3xl p-6 border border-border/50 shadow-sm'
                        )}>
                            {msg.photoDataUri && (
                                <ImagePreview src={msg.photoDataUri} alt="User upload" />
                            )}
                            {msg.quote && msg.role === 'user' && (
                                <div className="border-l-4 border-primary/30 pl-4 py-2 mb-3 text-sm text-muted-foreground bg-primary/5 rounded-r-xl max-w-lg italic">
                                    {msg.quote}
                                </div>
                            )}
                            <div className={cn(
                                msg.role === 'user' ? 'bg-primary text-primary-foreground px-5 py-3.5 rounded-3xl rounded-tr-none shadow-lg' : ''
                            )}>
                                <MessageContent 
                                    content={msg.content} 
                                />
                            </div>
                        </div>
                        {msg.role === 'user' && (
                            <Avatar className="h-10 w-10 border shrink-0 shadow-sm">
                                <AvatarImage src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop" />
                                <AvatarFallback><User className="h-6 w-6 text-muted-foreground"/></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-5">
                        <Avatar className="h-10 w-10 border-2 border-primary/20 shrink-0">
                            <AvatarFallback className="bg-primary/5"><Sparkles className="h-6 w-6 text-primary animate-pulse"/></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted/30 rounded-3xl px-6 py-4 border border-border/50">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div>
            <ScrollToBottomButton chatRef={scrollAreaRef} />
        </div>

        <div className="px-4 pb-8 w-full shrink-0 border-t bg-background/80 backdrop-blur-md z-50">
            <div className="max-w-3xl mx-auto pt-6">
                {quotedText && (
                    <div className="flex items-center justify-between bg-primary/5 border-l-4 border-primary p-4 rounded-r-2xl mb-4 animate-in slide-in-from-bottom-2 shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <Quote className="h-5 w-5 text-primary shrink-0 opacity-50" />
                            <p className="text-sm truncate text-muted-foreground italic">"{quotedText}"</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10" onClick={() => setQuotedText(null)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}
                {imagePreview && (
                    <div className="relative w-32 h-32 mb-4 rounded-2xl overflow-hidden shadow-2xl border-2 border-primary ring-4 ring-primary/10 animate-in zoom-in">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-lg" onClick={() => { setImagePreview(null); setImageDataUri(null); }}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="relative">
                    <div className="input-wrapper border-2 border-border/50 hover:border-primary/30 transition-all bg-muted/20 relative h-auto min-h-[4rem] flex items-center overflow-hidden rounded-[1.25rem] shadow-sm">
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                        <Button 
                            type="button" variant="ghost" size="icon" 
                            className="absolute left-3 h-11 w-11 text-muted-foreground z-20 hover:bg-primary/10"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip className="h-6 w-6" />
                        </Button>
                        <Input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Спросите Findora о чем угодно..."
                            className="w-full h-16 pl-14 pr-16 rounded-[1.25rem] border-none shadow-none bg-transparent text-lg focus-visible:ring-0 relative z-10 text-foreground"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !imageDataUri)} className="absolute right-3 h-11 w-11 rounded-full shadow-xl z-20 transition-transform active:scale-90">
                            <ArrowUp className="h-6 w-6" />
                        </Button>
                    </div>
                </form>
                <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-[0.2em] font-black opacity-40">Findora Intelligence Engine</p>
            </div>
        </div>
    </div>
  );
}
