"use client";

import React, { createContext, useState, ReactNode } from 'react';
import { initialData } from '@/lib/data';
import type { User, Service, Review, Category, Conversation, ChatMessage } from '@/lib/types';

interface DataContextType {
  users: User[];
  services: Service[];
  reviews: Review[];
  categories: Category[];
  conversations: Conversation[];
  addConversation: (conversation: Conversation) => void;
  addMessageToConversation: (conversationId: string, message: ChatMessage) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(initialData);

  const addConversation = (conversation: Conversation) => {
    setData(prevData => ({
      ...prevData,
      conversations: [conversation, ...prevData.conversations]
    }));
  };

  const addMessageToConversation = (conversationId: string, message: ChatMessage) => {
    setData(prevData => {
      const newConversations = prevData.conversations.map(convo => {
        if (convo.id === conversationId) {
          return {
            ...convo,
            messages: [...convo.messages, message],
            lastMessage: message.text,
            timestamp: message.timestamp,
          };
        }
        return convo;
      });

      // Move the updated conversation to the top
      const updatedConvo = newConversations.find(c => c.id === conversationId);
      const otherConvos = newConversations.filter(c => c.id !== conversationId);
      
      return {
        ...prevData,
        conversations: updatedConvo ? [updatedConvo, ...otherConvos] : newConversations
      };
    });
  };

  const value = {
    users: data.users,
    services: data.services,
    reviews: data.reviews,
    categories: data.categories,
    conversations: data.conversations,
    addConversation,
    addMessageToConversation,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
