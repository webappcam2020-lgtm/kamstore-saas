import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ChatWidget } from '@/components/chat/chat-widget';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'KamStore - Services & Tourisme au Cameroun',
  description: 'Plateforme multi-services au Cameroun: Localisation, Tourisme, Logement',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
