import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tate',
  description: '文字列を縦に表示するSVGを生成するWebアプリ',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Tate',
    description: '文字列を縦に表示するSVGを生成するWebアプリ',
    url: 'https://tategen.netlify.app',
    images: [
      {
        url: 'https://tategen.netlify.app/favicon.ico',
        width: 180,
        height: 180,
        alt: 'Tate',
      },
    ],
    siteName: 'Tate',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tate',
    description: '文字列を縦に表示するSVGを生成するWebアプリ',
    images: ['https://tategen.netlify.app/favicon.ico'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
