import type { Metadata } from 'next';
import '@workspace/ui/styles/globals.css';
import { Toaster } from '@workspace/ui';
import { ReduxProvider } from '@/store/provider';
import { InitApp } from './components/init-app';

export const metadata: Metadata = {
  title: 'Coffee Shop Management',
  description: 'Quản lý coffee shop hiện đại',
  themeColor: '#222a63',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Coffee Shop',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <ReduxProvider>
          <InitApp />
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
