import type { Metadata, Viewport } from 'next';
import './globals.css';
import { weddingConfig } from '@/lib/weddingConfig';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const title = `The Wedding of ${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}`;
const description = `Tanpa Mengurangi Rasa Hormat. Kami Bermaksud Mengundang Bapak/Ibu/Saudara/i, Pada Acara ${weddingConfig.resepsi.title} Pernikahan Kami.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: weddingConfig.metadata.url,
    type: 'website',
    images: [
      {
        url: weddingConfig.metadata.ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [weddingConfig.metadata.ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="notranslate" translate="no">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://assets.satumomen.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.satumomen.com" />
        
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Grenze+Gotisch:wght@400;700&family=Homemade+Apple&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" />
        <link rel="icon" type="image/png" href="/assets/watermark.jpg" />
        <link rel="preload" href="/assets/bg.jpg" as="image" />
        <link rel="preload" href="/assets/door-left.png" as="image" />
        <link rel="preload" href="/assets/door-right.png" as="image" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/fill/style.css" />
        <link rel="stylesheet" href="https://assets.satumomen.com/build/assets/bootstrap-vCaDZZbr.css" />
        <link rel="stylesheet" href="https://assets.satumomen.com/build/assets/themesv2-DZZF_N8v.css" />
      </head>
      <body className="antialiased selection:bg-[#B6A38B] selection:text-[#2b1b19] custom-scrollbar">
        {children}
      </body>
    </html>
  );
}
