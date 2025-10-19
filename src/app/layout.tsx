import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FavoritesProvider } from '@/context/favorites-provider';
import Header from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth-provider';
import PageWrapper from '@/components/page-wrapper';
import { CartProvider } from '@/context/cart-provider';
import { DataProvider } from '@/context/data-provider';

export const metadata: Metadata = {
  title: 'BizMart',
  description: 'Находите и заказывайте услуги от проверенных исполнителей.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
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
                  <PageWrapper>
                    {children}
                  </PageWrapper>
                  <Toaster />
                </CartProvider>
              </FavoritesProvider>
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
