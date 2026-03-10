
"use client";

import { useState, useRef, useEffect, memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, User, Star, Paperclip, X, Quote, MessageSquare, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiChat, type AIChatInput } from '@/ai/flows/ai-chat';
import { useData } from '@/hooks/use-data';
import type { Service, User as ProviderUser } from '@/lib/types';
import Logo from '@/components/logo';
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
    <Link href={`/services/${service.id}`} className="block bg-card hover:bg-muted/50 rounded-xl overflow-hidden transition-all duration-300 my-4 border shadow-sm">
        <div className="relative h-48 w-full">
            <Image src={service.images[0]} alt={service.title} fill className="object-cover" />
        </div>
        <div className="p-4">
            <h4 className="font-semibold text-lg truncate">{service.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{service.description}</p>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5 text-sm">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{service.rating.toFixed(1)}</span>
                </div>
                <p className="text-lg font-bold text-primary">{service.price} TJS</p>
            </div>
        </div>
    </Link>
));
ServiceCardComponent.displayName = 'ServiceCardComponent';

const ProviderCardComponent = memo(({ provider }: { provider: ProviderUser }) => {
    return (
        <Link href={`/profile/${provider.username}`} className="block bg-card hover:bg-muted/50 rounded-xl overflow-hidden transition-all duration-300 my-4 border shadow-sm">
            <div className="p-5 flex items-center gap-4">
                 <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <h4 className="font-semibold text-lg truncate">{provider.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">@{provider.username}</p>
                    <div className="flex items-center gap-1 text-sm mt-2 text-primary">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">Проверенный исполнитель</span>
                    </div>
                </div>
            </div>
        </Link>
    )
});
ProviderCardComponent.displayName = 'ProviderCardComponent';

const MessageContent = ({ content, onQuote }: { content: string; onQuote?: (text: string) => void }) => {
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
                            className="prose prose-sm dark:prose-invert max-w-none leading-relaxed" 
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
  
  // Selection state
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

    const fullMessage = quotedText ? `> ${quotedText}\n\n${input}` : input;
    const userMessage: Message = { 
        role: 'user', 
        content: fullMessage, 
        photoDataUri: imageDataUri || undefined,
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
        photoDataUri: imageDataUri || undefined,
      });
      
      setMessages(prev => [...prev, { role: 'model', content: result.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Произошла ошибка. Попробуйте еще раз." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background font-body">
        {/* Floating Selection Tool */}
        {selection && (
            <div 
                className="fixed z-[100] animate-in fade-in zoom-in duration-200"
                style={{ left: selection.x, top: selection.y, transform: 'translateX(-50%)' }}
            >
                <Button 
                    size="sm" 
                    className="shadow-xl rounded-full bg-primary hover:bg-primary/90 flex items-center gap-2 px-4 h-9"
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
                      <h1 className="text-4xl font-bold font-headline mb-4">Как я могу помочь?</h1>
                      <p className="text-muted-foreground text-lg">Найду исполнителя, подскажу цену или подберу товар по фото.</p>
                  </div>
              )}
                <div className="space-y-10">
                {messages.map((msg, index) => (
                    <div key={index} className={cn("flex items-start gap-4", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'model' && (
                            <Avatar className="h-9 w-9 border-2 border-primary/20 shrink-0">
                                <AvatarFallback className="bg-primary/5"><Sparkles className="h-5 w-5 text-primary"/></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn(
                            "max-w-[85%] group",
                            msg.role === 'user' ? 'flex flex-col items-end' : 'bg-muted/30 rounded-2xl p-4 border border-border/50'
                        )}>
                            {msg.photoDataUri && (
                                <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden mb-3 border shadow-sm">
                                    <Image src={msg.photoDataUri} alt="User upload" fill className="object-cover" />
                                </div>
                            )}
                            {msg.quote && msg.role === 'user' && (
                                <div className="border-l-4 border-primary/30 pl-3 py-1 mb-2 text-sm text-muted-foreground bg-primary/5 rounded-r-md">
                                    {msg.quote}
                                </div>
                            )}
                            <div className={cn(
                                msg.role === 'user' ? 'bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-none shadow-md' : ''
                            )}>
                                <MessageContent 
                                    content={msg.content} 
                                />
                            </div>
                        </div>
                        {msg.role === 'user' && (
                            <Avatar className="h-9 w-9 border shrink-0">
                                <AvatarImage src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop" />
                                <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4">
                        <Avatar className="h-9 w-9 border-2 border-primary/20 shrink-0">
                            <AvatarFallback className="bg-primary/5"><Sparkles className="h-5 w-5 text-primary animate-pulse"/></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted/30 rounded-2xl px-4 py-3 border border-border/50">
                            <div className="flex gap-1">
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

        <div className="px-4 pb-6 w-full shrink-0 border-t bg-background/80 backdrop-blur-md z-50">
            <div className="max-w-3xl mx-auto pt-4">
                {quotedText && (
                    <div className="flex items-center justify-between bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg mb-3 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Quote className="h-4 w-4 text-primary shrink-0" />
                            <p className="text-sm truncate text-muted-foreground italic">"{quotedText}"</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setQuotedText(null)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                {imagePreview && (
                    <div className="relative w-24 h-24 mb-3 rounded-xl overflow-hidden shadow-lg border-2 border-primary/20">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full" onClick={() => { setImagePreview(null); setImageDataUri(null); }}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="relative">
                    <div className="input-wrapper border-2 border-border/50 hover:border-primary/30 transition-colors bg-muted/20 relative h-auto min-h-[3.5rem] flex items-center overflow-visible">
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                        <Button 
                            type="button" variant="ghost" size="icon" 
                            className="absolute left-2 h-10 w-10 text-muted-foreground hover:text-primary z-20"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Спросите Findora о чем угодно..."
                            className="w-full h-14 pl-12 pr-14 rounded-xl border-none shadow-none bg-transparent text-base focus-visible:ring-0 relative z-10 text-foreground"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !imageDataUri)} className="absolute right-2 h-10 w-10 rounded-xl shadow-lg z-20">
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </form>
                <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-widest font-semibold opacity-50">Powered by Findora Intelligence</p>
            </div>
        </div>
    </div>
  );
}
