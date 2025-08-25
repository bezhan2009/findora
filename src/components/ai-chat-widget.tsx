
"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Sparkles, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiChat } from '@/ai/flows/ai-chat';
import type { AIChatInput } from '@/ai/flows/ai-chat';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface AIChatWidgetProps {
  onClose: () => void;
}

export default function AIChatWidget({ onClose }: AIChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Hello! How can I help you today?' }
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
    // A slight delay to ensure the DOM has updated before scrolling
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
    <Card className="fixed bottom-20 right-5 w-96 h-[60vh] flex flex-col shadow-2xl rounded-2xl z-50">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary"/>
                <CardTitle className="text-lg font-headline">AI Assistant</CardTitle>
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
                            <p className="text-sm">{msg.content}</p>
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
                                <p className="text-sm text-muted-foreground animate-pulse">Thinking...</p>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="p-3 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
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
