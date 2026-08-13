import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Wedding of Imam & Hitna',
  description: 'Tanpa Mengurangi Rasa Hormat. Kami Bermaksud Mengundang Bapak/Ibu/Saudara/i, Pada Acara Ngunduh Mantu Pernikahan Kami.',
  openGraph: {
    title: 'The Wedding of Imam & Hitna',
    description: 'Tanpa Mengurangi Rasa Hormat. Kami Bermaksud Mengundang Bapak/Ibu/Saudara/i, Pada Acara Ngunduh Mantu Pernikahan Kami.',
    url: 'https://inv.ruanginvi.com/imam-and-hitna',
    type: 'website',
    images: [
      {
        url: 'https://assets.satumomen.com/images/invitation/cover-5305701744812750.jpg',
        width: 1200,
        height: 630,
        alt: 'The Wedding of Imam & Hitna',
      },
    ],
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
        <link rel="icon" type="image/png" href="/assets/watermark.jpg" />
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
