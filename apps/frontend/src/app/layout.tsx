import './global.css';
import { Passion_One, Jost, Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Analytics } from '@vercel/analytics/next';
import NextTopLoader from 'nextjs-toploader';
import { GoogleAnalytics } from '@next/third-parties/google';

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

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.easypicsybooths.com'),
  title: 'Easy Picsy - Professional Photobooth Software with GCash Payments | Philippines',
  description:
    'Easy Picsy is the leading photobooth management software for rental businesses in the Philippines. Features GCash/QRPh payments, real-time analytics, cloud management, and white-label branding for weddings and corporate events.',
  keywords: [
    'photobooth software Philippines',
    'photobooth rental business',
    'GCash photobooth payments',
    'QRPh photobooth',
    'wedding photobooth software',
    'cashless photobooth',
    'photobooth management system',
    'event photography software',
    'photobooth analytics',
    'cloud photobooth software',
    'white label photobooth',
    'photobooth business solution',
    'contactless payments photobooth',
    'drag and drop branding',
    'photobooth supplier software',
  ],
  authors: [{ name: 'Easy Picsy Team' }],
  creator: 'Easy Picsy',
  publisher: 'Easy Picsy',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://www.easypicsybooths.com',
    siteName: 'Easy Picsy',
    title: 'Easy Picsy - Professional Photobooth Software with GCash Payments',
    description:
      'Transform your photobooth rental business with Easy Picsy. GCash/QRPh integration, real-time analytics, cloud management, and custom branding for weddings and events in the Philippines.',
    images: [
      {
        url: '/logo.svg',
        width: 800,
        height: 600,
        alt: 'Easy Picsy - Professional Photobooth Software',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Easy Picsy - Professional Photobooth Software with GCash Payments',
    description:
      'Transform your photobooth rental business with Easy Picsy. GCash/QRPh integration, real-time analytics, and custom branding.',
    images: ['/logo.svg'],
  },
  alternates: {
    canonical: 'https://www.easypicsybooths.com',
  },
  category: 'Business Software',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FEF08A" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${passionOne.variable} ${jost.variable} ${inter.variable} antialiased`}>
        <NextTopLoader
          color="linear-gradient(to right, #FEF08A, #F97316)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #F97316,0 0 5px #FEF08A"
        />
        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string} />
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
