
"use client";

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, User, MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiChat } from '@/ai/flows/ai-chat';
import type { AIChatInput } from '@/ai/flows/ai-chat';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Hello! How can I help you find the perfect service on BizMart today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
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
      console.error("AI chat error:", error);
      const errorMessage: Message = { role: 'model', content: "I'm sorry, something went wrong. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="w-16 h-16 rounded-full shadow-lg">
           {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <Card className="h-[60vh] w-96 max-w-lg flex flex-col shadow-2xl rounded-xl">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                <Sparkles className="h-6 w-6 text-primary" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-0 flex flex-col">
                <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
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
                            "max-w-xs rounded-2xl px-4 py-3 break-words",
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
                                <p className="text-sm text-muted-foreground animate-pulse">Thinking...</p>
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
                        placeholder="Ask anything..."
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
      )}
    </>
  );
}
