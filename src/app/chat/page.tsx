
"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Conversation as ConversationType, ChatMessage } from '@/lib/types';
import Link from 'next/link';
import { useData } from '@/hooks/use-data';
import { useAuth } from '@/hooks/use-auth';

export default function ChatPage() {
  const { conversations, addMessageToConversation } = useData();
  const { user: authUser } = useAuth();
  const searchParams = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const convoId = searchParams.get('new');
    let conversationToSelect: ConversationType | null = null;
    
    if (convoId) {
      conversationToSelect = conversations.find(c => c.id === convoId) || null;
    } else if (conversations.length > 0) {
      conversationToSelect = conversations[0];
    }
    
    setSelectedConversation(conversationToSelect);
  }, [searchParams, conversations]);

  useEffect(() => {
     if (selectedConversation) {
      const updatedConvo = conversations.find(c => c.id === selectedConversation.id);
      if (updatedConvo) {
        setSelectedConversation(updatedConvo);
      }
    }
    setTimeout(scrollToBottom, 100);
  }, [conversations, selectedConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !authUser) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit'}),
    };
    
    addMessageToConversation(selectedConversation.id, message);
    setNewMessage('');
    inputRef.current?.focus();
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="container mx-auto px-4 pt-8">
          <div className="flex items-center gap-4 mb-8">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold font-headline">Сообщения</h1>
          </div>
      </div>
      <Card className="flex-grow w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 overflow-hidden rounded-none border-t border-b-0">
        <div className="col-span-1 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold font-headline">Диалоги</h2>
          </div>
          <ScrollArea className="flex-grow">
            {conversations.map((convo) => (
              <button
                key={convo.id}
                className={cn(
                  "flex items-center gap-4 p-4 w-full text-left hover:bg-accent/50 transition-colors",
                  selectedConversation?.id === convo.id && "bg-accent"
                )}
                onClick={() => setSelectedConversation(convo)}
              >
                <Avatar>
                  <AvatarImage src={convo.participant.avatar} />
                  <AvatarFallback>{convo.participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow overflow-hidden">
                  <p className="font-semibold truncate">{convo.participant.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>
        <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b flex items-center gap-4">
                 <Link href={`/profile/${selectedConversation.participant.username}`}>
                    <Avatar>
                    <AvatarImage src={selectedConversation.participant.avatar} />
                    <AvatarFallback>{selectedConversation.participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
                 <Link href={`/profile/${selectedConversation.participant.username}`} className="hover:underline">
                    <h3 className="text-lg font-semibold font-headline">{selectedConversation.participant.name}</h3>
                </Link>
              </div>
              <ScrollArea className="flex-grow p-6 bg-muted/20" viewportRef={scrollViewportRef}>
                <div className="space-y-4">
                  {selectedConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2",
                        msg.sender === 'me' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {msg.sender === 'other' && authUser?.username !== selectedConversation.participant.username && (
                        <Avatar className="h-8 w-8">
                           <Link href={`/profile/${selectedConversation.participant.username}`}>
                            <AvatarImage src={selectedConversation.participant.avatar} />
                           </Link>
                        </Avatar>
                      )}
                       {msg.sender === 'me' && authUser && (
                         <Avatar className="h-8 w-8 order-2">
                           <Link href={`/profile/${authUser.username}`}>
                            <AvatarImage src={authUser.avatar} />
                           </Link>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2",
                          msg.sender === 'me'
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-card text-card-foreground border rounded-bl-none"
                        )}
                      >
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Input 
                    ref={inputRef}
                    placeholder="Напишите сообщение..." 
                    className="flex-grow" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-2xl font-semibold font-headline">Выберите диалог</h2>
              <p className="text-muted-foreground">Выберите диалог из левой панели, чтобы начать общение.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
