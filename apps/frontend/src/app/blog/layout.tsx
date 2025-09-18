import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Easy Picsy | Photobooth Business Tips & Guides',
  description: 'Discover expert tips, guides, and insights for growing your photobooth business in the Philippines. Learn about software, marketing, and industry trends.',
  keywords: [
    'photobooth business',
    'photobooth software',
    'Philippines',
    'Easy Picsy',
    'photobooth rental tips',
    'event photography',
    'GCash payments',
    'wedding photobooth',
    'photobooth marketing',
  ],
  openGraph: {
    title: 'Blog - Easy Picsy | Photobooth Business Tips & Guides',
    description: 'Discover expert tips, guides, and insights for growing your photobooth business in the Philippines. Learn about software, marketing, and industry trends.',
    url: 'https://www.easypicsybooths.com/blog',
    siteName: 'Easy Picsy',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image-blog.png',
        width: 1200,
        height: 630,
        alt: 'Easy Picsy Blog - Photobooth Business Tips & Guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Easy Picsy | Photobooth Business Tips & Guides',
    description: 'Discover expert tips, guides, and insights for growing your photobooth business in the Philippines. Learn about software, marketing, and industry trends.',
    images: ['/og-image-blog.png'],
    creator: '@easypicsybooths',
  },
  alternates: {
    canonical: 'https://www.easypicsybooths.com/blog',
  },
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
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}