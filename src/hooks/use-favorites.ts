"use client";

import { useContext } from 'react';
import { FavoritesContext } from '@/context/favorites-provider';

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    