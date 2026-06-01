import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const display = Plus_Jakarta_Sans({
  variable: '--font-display',
  subsets: ['latin'],
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FitTrackPro',
  description: 'Plataforma profesional de gestión fitness',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
