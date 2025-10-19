"use client";

import React, { createContext, useState, ReactNode } from 'react';
import { initialData } from '@/lib/data';
import type { User, Service, Review, Category, Conversation } from '@/lib/types';

interface DataContextType {
  users: User[];
  services: Service[];
  reviews: Review[];
  categories: Category[];
  conversations: Conversation[];
  // Add setter functions here later for CRUD operations
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(initialData);

  const value = {
    users: data.users,
    services: data.services,
    reviews: data.reviews,
    categories: data.categories,
    conversations: data.conversations,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
