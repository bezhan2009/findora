
"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FavoritesContextType {
  favoriteIds: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('Findora-favorites');
      if (storedFavorites) {
        setFavoriteIds(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Не удалось прочитать избранное из localStorage", error);
    }
  }, []);

  const updateLocalStorage = useCallback((ids: string[]) => {
    try {
      localStorage.setItem('Findora-favorites', JSON.stringify(ids));
    } catch (error) {
      console.error("Не удалось сохранить избранное в localStorage", error);
    }
  }, []);

  const addFavorite = (id: string) => {
    if (favoriteIds.includes(id)) return;
    
    const newIds = [...favoriteIds, id];
    setFavoriteIds(newIds);
    updateLocalStorage(newIds);
    toast({ title: 'Добавлено в избранное!' });
  };

  const removeFavorite = (id: string) => {
    if (!favoriteIds.includes(id)) return;

    const newIds = favoriteIds.filter((favId) => favId !== id);
    setFavoriteIds(newIds);
    updateLocalStorage(newIds);
    toast({ title: 'Удалено из избранного' });
  };

  const isFavorite = (id: string) => {
    return favoriteIds.includes(id);
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
