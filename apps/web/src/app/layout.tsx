import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Digital Labour Chowk - Find Skilled Workers',
    template: '%s | Digital Labour Chowk',
  },
  description:
    'India\'s most trusted labour marketplace. Find skilled workers, daily wage laborers, and contractors across India. Connect, hire, and grow your business.',
  keywords: ['labour', 'workers', 'contractors', 'daily wage', 'India', 'jobs', 'hiring', 'skills'],
  authors: [{ name: 'Digital Labour Chowk' }],
  creator: 'Digital Labour Chowk',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://digitallabourchowk.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    title: 'Digital Labour Chowk',
    description: 'India\'s most trusted labour marketplace',
    siteName: 'Digital Labour Chowk',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Digital Labour Chowk' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Labour Chowk',
    description: 'India\'s most trusted labour marketplace',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1d4ed8' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
