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
import { ArrowUp, Sparkles, User, Star, Paperclip, X, Quote, Maximize2, ExternalLink } from 'lucide-react';
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

const CompactServiceCard = memo(({ service }: { service: Service }) => (
    <Link href={`/services/${service.id}`} className="group block bg-card hover:bg-muted/40 rounded-xl overflow-hidden transition-all duration-300 my-4 border shadow-sm hover:shadow-md">
        <div className="flex items-center p-3 gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                <Image 
                    src={service.images[0]} 
                    alt={service.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                />
            </div>
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">{service.category}</span>
                </div>
                <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{service.title}</h4>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-bold">{service.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm font-black text-primary">{service.price} TJS</p>
                </div>
            </div>
            <div className="p-2 text-muted-foreground group-hover:text-primary transition-colors">
                <ExternalLink className="h-4 w-4" />
            </div>
        </div>
    </Link>
));
CompactServiceCard.displayName = 'CompactServiceCard';

const CompactProviderCard = memo(({ provider }: { provider: ProviderUser }) => {
    return (
        <Link href={`/profile/${provider.username}`} className="group block bg-card hover:bg-muted/40 rounded-xl overflow-hidden transition-all duration-300 my-4 border shadow-sm hover:shadow-md">
            <div className="p-3 flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-primary/10 p-0.5 bg-background">
                    <AvatarImage src={provider.avatar} alt={provider.name} className="rounded-full object-cover" />
                    <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{provider.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">@{provider.username}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/5 px-1.5 py-0.5 rounded-sm">
                            <Star className="h-2.5 w-2.5 fill-current" />
                            <span>Топ исполнитель</span>
                        </div>
                    </div>
                </div>
                <div className="p-2 text-muted-foreground group-hover:text-primary transition-colors">
                    <ExternalLink className="h-4 w-4" />
                </div>
            </div>
        </Link>
    )
});
CompactProviderCard.displayName = 'CompactProviderCard';

const ImagePreview = ({ src, alt }: { src: string; alt: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative group cursor-zoom-in mt-2 mb-4 overflow-hidden rounded-2xl border shadow-md transition-all hover:shadow-xl bg-muted/20 min-h-[100px] flex items-center justify-center">
                    <img 
                        src={src} 
                        alt={alt} 
                        className="max-w-full h-auto max-h-[300px] object-contain rounded-2xl mx-auto transition-transform duration-500 group-hover:scale-[1.02]" 
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
                    return service ? <AnimatedCard key={index}><CompactServiceCard service={service} /></AnimatedCard> : null;
                }
                if (part.startsWith('PROVIDER_CARD')) {
                    const username = part.match(/\[(.*?)\]/)?.[1];
                    const provider = users.find(u => u.username === username);
                    return provider ? <AnimatedCard key={index}><CompactProviderCard provider={provider} /></AnimatedCard> : null;
                }
                
                let cleanedPart = part;
                if (index > 0 && parts[index-1].match(/(SERVICE_CARD|PROVIDER_CARD)/)) {
                    cleanedPart = cleanedPart.replace(/^[\s.,;:)\]!]+/, '');
                }

                return (
                    <div key={index} className="relative select-text">
                        <ReactMarkdown 
                            className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-sm md:text-base" 
                            remarkPlugins={[remarkGfm]}
                        >
                            {cleanedPart}
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
            <div className={cn("max-w-2xl mx-auto px-4 pt-12 pb-20", messages.length > 1 ? "w-full" : "flex flex-col justify-center h-full")}>
              {messages.length <= 1 && (
                  <div className="text-center mb-12 animate-in fade-in zoom-in duration-700">
                      <div className="flex justify-center mb-6">
                        <div className="p-4 bg-primary/10 rounded-3xl">
                            <Sparkles className="h-12 w-12 text-primary" />
                        </div>
                      </div>
                      <h1 className="text-4xl font-bold font-headline mb-4 tracking-tight">Чем могу помочь?</h1>
                      <p className="text-muted-foreground text-lg max-w-md mx-auto">Подберу специалиста, сравню цены или распознаю товар по фото.</p>
                  </div>
              )}
                <div className="space-y-8">
                {messages.map((msg, index) => (
                    <div key={index} className={cn("flex items-start gap-4", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'model' && (
                            <Avatar className="h-9 w-9 border-2 border-primary/20 shrink-0 shadow-sm">
                                <AvatarFallback className="bg-primary/5 text-primary"><Sparkles className="h-5 w-5"/></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn(
                            "max-w-[85%] group",
                            msg.role === 'user' ? 'flex flex-col items-end' : 'bg-muted/20 rounded-3xl p-5 border border-border/40 shadow-sm'
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
                                msg.role === 'user' ? 'bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-none shadow-md' : ''
                            )}>
                                <MessageContent 
                                    content={msg.content} 
                                />
                            </div>
                        </div>
                        {msg.role === 'user' && (
                            <Avatar className="h-9 w-9 border shrink-0 shadow-sm">
                                <AvatarImage src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop" />
                                <AvatarFallback><User className="h-5 w-5 text-muted-foreground"/></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4">
                        <Avatar className="h-9 w-9 border-2 border-primary/20 shrink-0">
                            <AvatarFallback className="bg-primary/5"><Sparkles className="h-5 w-5 text-primary animate-pulse"/></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted/20 rounded-3xl px-5 py-3 border border-border/40">
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
            <ScrollToBottomButton chatRef={scrollAreaRef} />
        </div>

        <div className="px-4 pb-8 w-full shrink-0 border-t bg-background/80 backdrop-blur-md z-50">
            <div className="max-w-3xl mx-auto pt-6">
                {quotedText && (
                    <div className="flex items-center justify-between bg-primary/5 border-l-4 border-primary p-3 rounded-r-xl mb-4 animate-in slide-in-from-bottom-2 shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <Quote className="h-4 w-4 text-primary shrink-0 opacity-50" />
                            <p className="text-xs truncate text-muted-foreground italic">"{quotedText}"</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-primary/10" onClick={() => setQuotedText(null)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                {imagePreview && (
                    <div className="relative w-24 h-24 mb-4 rounded-xl overflow-hidden shadow-xl border-2 border-primary animate-in zoom-in">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full shadow-lg" onClick={() => { setImagePreview(null); setImageDataUri(null); }}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="relative">
                    <div className="input-wrapper border-2 border-border/50 hover:border-primary/30 transition-all bg-muted/10 relative h-auto min-h-[3.5rem] flex items-center overflow-hidden rounded-2xl shadow-sm">
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                        <Button 
                            type="button" variant="ghost" size="icon" 
                            className="absolute left-2 h-10 w-10 text-muted-foreground z-20 hover:bg-primary/10"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Спросите Findora..."
                            className="w-full h-14 pl-12 pr-14 rounded-2xl border-none shadow-none bg-transparent text-base focus-visible:ring-0 relative z-10 text-foreground"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !imageDataUri)} className="absolute right-2 h-10 w-10 rounded-full shadow-lg z-20 transition-transform active:scale-90 bg-primary hover:bg-primary/90">
                            <ArrowUp className="h-5 w-5 text-white" />
                        </Button>
                    </div>
                </form>
                <p className="text-[9px] text-center text-muted-foreground mt-3 uppercase tracking-widest font-black opacity-30">Powered by Findora Intelligence</p>
            </div>
        </div>
    </div>
  );
}