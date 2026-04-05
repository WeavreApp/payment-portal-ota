import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth-provider';
import { Toaster } from '@/components/ui/sonner';
import { Footer } from '@/components/ui/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ota Total Academy - Payment Portal',
  description: 'Secure school fee payment management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <AuthProvider>
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
