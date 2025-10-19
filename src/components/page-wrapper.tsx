"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState } from 'react';
import { Button } from './ui/button';
import { Sparkles, X } from 'lucide-react';
import AIChatWidget from './ai-chat-widget';

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const showFooter = pathname !== '/chat' && pathname !== '/ai-chat';
  const showChatWidget = pathname !== '/ai-chat';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
      {showChatWidget && (
        <>
            <Button 
                className="fixed bottom-5 right-5 h-16 w-16 rounded-full shadow-2xl"
                size="icon"
                onClick={() => setIsChatOpen(!isChatOpen)}
                aria-label={isChatOpen ? "Закрыть чат" : "Открыть AI чат"}
            >
                {isChatOpen ? <X className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}
            </Button>
            {isChatOpen && <AIChatWidget onClose={() => setIsChatOpen(false)} />}
        </>
      )}
    </div>
  );
}
