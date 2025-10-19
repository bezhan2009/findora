"use client";

import React, { createContext, useState, ReactNode } from 'react';
import { initialData } from '@/lib/data';
import type { User, Service, Review, Category, Conversation, ChatMessage, Post } from '@/lib/types';

interface DataContextType {
  users: User[];
  services: Service[];
  reviews: Review[];
  categories: Category[];
  conversations: Conversation[];
  addConversation: (conversation: Conversation) => void;
  addMessageToConversation: (conversationId: string, message: ChatMessage) => void;
  addService: (service: Service) => void;
  addPost: (username: string, post: Post) => void;
  addReview: (serviceId: string, review: Review) => void;
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

  const addService = (service: Service) => {
    setData(prevData => ({
      ...prevData,
      services: [service, ...prevData.services]
    }));
  };

  const addPost = (username: string, post: Post) => {
    setData(prevData => {
      const newUsers = prevData.users.map(user => {
        if (user.username === username) {
          const updatedPosts = user.posts ? [post, ...user.posts] : [post];
          return { ...user, posts: updatedPosts };
        }
        return user;
      });
      return { ...prevData, users: newUsers };
    });
  };

  const addReview = (serviceId: string, review: Review) => {
    setData(prevData => {
        const newReviews = [review, ...prevData.reviews];
        const newServices = prevData.services.map(service => {
            if (service.id === serviceId) {
                const newReviewsCount = service.reviewsCount + 1;
                const totalRating = (service.rating * service.reviewsCount) + review.rating;
                const newRating = totalRating / newReviewsCount;
                return {
                    ...service,
                    reviews: [review.id, ...service.reviews],
                    reviewsCount: newReviewsCount,
                    rating: newRating,
                };
            }
            return service;
        });
        return {
            ...prevData,
            reviews: newReviews,
            services: newServices,
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
    addService,
    addPost,
    addReview
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
