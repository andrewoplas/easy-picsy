import './global.css';
import { Passion_One, Jost } from 'next/font/google';

const passionOne = Passion_One({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-passion-one',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata = {
  title: 'Easy Picsy - Made for owners. Loved by guests.',
  description: 'Easy Picsy is the modern photobooth software designed for both suppliers and guests. We\'re reimagining photobooths to be smarter, faster, and more fun with contactless payments and drag-and-drop customization.',
  keywords: ['photobooth', 'software', 'cashless', 'payments', 'events', 'QR', 'GCash', 'modern'],
  openGraph: {
    title: 'Easy Picsy - Modern Photobooth Software',
    description: 'Contactless photobooth software with QR payments, real-time analytics, and drag-and-drop branding.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${passionOne.variable} ${jost.variable} antialiased`}>{children}</body>
    </html>
  );
}
