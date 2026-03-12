
import type { Metadata } from 'next';
import './globals.css';
import PageWrapper from '@/components/page-wrapper';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'Findora — Маркетплейс товаров и услуг',
  description: 'Найдите идеальные услуги от проверенных исполнителей с помощью AI.',
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
      <body className="font-body antialiased flex flex-col h-screen">
        <Providers>
          <PageWrapper>
            {children}
          </PageWrapper>
        </Providers>
      </body>
    </html>
  );
}
