import type { Metadata } from 'next';

interface BlogPostMetadata {
  title: string;
  slug: string;
  metaDescription: string;
  seoTitle: string;
  date: string;
  author: string;
  readTime: string;
  excerpt: string;
}

const blogPosts: Record<string, BlogPostMetadata> = {
  'dslrbooth-lumabooth-easy-picsy-comparison': {
    title: 'DSLRBooth vs. LumaBooth vs. Easy Picsy: Best Photobooth Software Compared',
    slug: 'dslrbooth-lumabooth-easy-picsy-comparison',
    metaDescription: 'Comparing DSLRBooth, LumaBooth, and Easy Picsy? Discover features, pricing, pros and cons, and why Easy Picsy is the future-ready photobooth software.',
    seoTitle: 'DSLRBooth vs. LumaBooth vs. Easy Picsy: Best Photobooth Software Compared',
    date: '2025-01-20',
    author: 'Easy Picsy Team',
    readTime: '8 min read',
    excerpt: 'Compare the top 3 photobooth software options: DSLRBooth, LumaBooth, and Easy Picsy. Discover features, pricing, and why Easy Picsy is built for the future.',
  },
  'photobooth-business-cost-philippines-2025': {
    title: 'How Much Does It Cost to Build a Photobooth Business in the Philippines (2025 Guide)',
    slug: 'photobooth-business-cost-philippines-2025',
    metaDescription: 'Discover how much it costs to start a photobooth business in the Philippines in 2025. Learn startup expenses, earnings, ROI, and tips to succeed.',
    seoTitle: 'How Much Does It Cost to Build a Photobooth Business in the Philippines (2025 Guide)',
    date: '2025-01-18',
    author: 'Easy Picsy Team',
    readTime: '12 min read',
    excerpt: 'Complete breakdown of photobooth business startup costs in the Philippines for 2025, including equipment, software, and expected ROI timelines.',
  },
  'gen-z-millennials-love-photobooths': {
    title: 'Why Gen Z and Millennials Love Photobooths (And What It Means for Events)',
    slug: 'gen-z-millennials-love-photobooths',
    metaDescription: 'Gen Z and Millennials are driving the photobooth boom. Discover why younger generations love booths and how your business can capture this market.',
    seoTitle: 'Why Gen Z and Millennials Love Photobooths (And What It Means for Events)',
    date: '2025-01-22',
    author: 'Easy Picsy Team',
    readTime: '6 min read',
    excerpt: 'Understanding why Gen Z and Millennials are obsessed with photobooths and how to design your rental business to capture this growing market.',
  },
};

export function getBlogPostMetadata(slug: string): BlogPostMetadata | null {
  return blogPosts[slug] || null;
}

export function generateBlogMetadata(slug: string): Metadata {
  const post = blogPosts[slug];

  if (!post) {
    return {
      title: 'Blog Post Not Found - Easy Picsy',
      description: 'The requested blog post could not be found.',
    };
  }

  const canonicalUrl = `https://www.easypicsybooths.com/blog/${slug}`;

  return {
    title: post.seoTitle,
    description: post.metaDescription,
    keywords: [
      'photobooth software',
      'photobooth business',
      'Philippines',
      'Easy Picsy',
      'photobooth rental',
      'event photography',
      'GCash payments',
      'wedding photobooth',
    ],
    authors: [{ name: post.author }],
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      url: canonicalUrl,
      siteName: 'Easy Picsy',
      locale: 'en_US',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: '/og-image-blog.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle,
      description: post.metaDescription,
      images: ['/og-image-blog.png'],
      creator: '@easypicsybooths',
    },
    alternates: {
      canonical: canonicalUrl,
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
}