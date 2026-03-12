
"use client";

import * as React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth-provider';
import { DataProvider } from '@/context/data-provider';
import { FavoritesProvider } from '@/context/favorites-provider';
import { CartProvider } from '@/context/cart-provider';
import { Toaster } from '@/components/ui/toaster';

/**
 * @fileOverview Клиентский компонент для всех контекст-провайдеров приложения.
 * Изоляция провайдеров помогает избежать ChunkLoadError в RootLayout и проблем с гидратацией.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <DataProvider>
          <FavoritesProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </FavoritesProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
