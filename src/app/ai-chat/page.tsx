"use client";

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, User, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiChat } from '@/ai/flows/ai-chat';
import type { AIChatInput } from '@/ai/flows/ai-chat';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Здравствуйте! Как я могу помочь вам найти идеальную услугу на BizMart сегодня?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

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
        history: messages.map(msg => ({ role: msg.role, content: msg.content })),
        message: input,
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
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-8rem)] flex flex-col">
       <div className="flex items-center gap-4 mb-8">
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold font-headline">AI Ассистент</h1>
      </div>
      <Card className="flex-grow flex flex-col shadow-lg rounded-xl">
        <CardContent className="p-0 flex flex-col flex-grow overflow-hidden">
            <ScrollArea className="flex-grow p-6" viewportRef={scrollViewportRef}>
                <div className="space-y-6">
                {messages.map((msg, index) => (
                    <div
                    key={index}
                    className={cn(
                        "flex items-start gap-4",
                        msg.role === 'user' && 'justify-end'
                    )}
                    >
                    {msg.role === 'model' && (
                        <Avatar className="h-9 w-9 border-2 border-primary/50">
                            <AvatarFallback>
                                <Sparkles className="h-5 w-5 text-primary"/>
                            </AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={cn(
                        "max-w-md rounded-2xl px-4 py-3 break-words",
                        msg.role === 'model'
                            ? "bg-muted rounded-bl-none"
                            : "bg-primary text-primary-foreground rounded-br-none"
                        )}
                    >
                        <p className="text-sm">{msg.content}</p>
                    </div>
                      {msg.role === 'user' && (
                        <Avatar className="h-9 w-9 border-2 border-muted">
                            <AvatarFallback>
                                <User className="h-5 w-5 text-muted-foreground"/>
                            </AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4">
                          <Avatar className="h-9 w-9 border-2 border-primary/50">
                            <AvatarFallback>
                                <Sparkles className="h-5 w-5 text-primary animate-pulse"/>
                            </AvatarFallback>
                        </Avatar>
                          <div className="max-w-md rounded-2xl px-4 py-3 bg-muted rounded-bl-none">
                            <p className="text-sm text-muted-foreground animate-pulse">Думаю...</p>
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Спросите что-нибудь..."
                    className="flex-grow"
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-5 w-5" />
                </Button>
                </form>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
