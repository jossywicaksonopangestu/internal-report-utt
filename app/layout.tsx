import type {Metadata} from 'next';
import {Inter, Manrope, Micro_5} from 'next/font/google';
import './globals.css';
import Providers from '@/lib/providers';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const micro5 = Micro_5({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-micro-5',
});

export const metadata: Metadata = {
  title: 'United Transworld Trading',
  description: 'Internal Reporting System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${inter.variable} ${micro5.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
