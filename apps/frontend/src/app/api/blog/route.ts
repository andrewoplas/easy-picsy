import { NextRequest, NextResponse } from 'next/server';

interface BlogPostMetadata {
  title: string;
  slug: string;
  metaDescription: string;
  seoTitle: string;
  date: string;
  author: string;
  readTime: string;
  excerpt: string;
  thumbnail: string;
}

const blogPosts: BlogPostMetadata[] = [
  {
    title: 'DSLRBooth vs. LumaBooth vs. Easy Picsy: Best Photobooth Software Compared',
    slug: 'dslrbooth-lumabooth-easy-picsy-comparison',
    metaDescription: 'Comparing DSLRBooth, LumaBooth, and Easy Picsy? Discover features, pricing, pros and cons, and why Easy Picsy is the future-ready photobooth software.',
    seoTitle: 'DSLRBooth vs. LumaBooth vs. Easy Picsy: Best Photobooth Software Compared',
    date: '2025-01-20',
    author: 'Easy Picsy Team',
    readTime: '8 min read',
    excerpt: 'Compare the top 3 photobooth software options: DSLRBooth, LumaBooth, and Easy Picsy. Discover features, pricing, and why Easy Picsy is built for the future.',
    thumbnail: '/blogs/DSLRBooth vs. LumaBooth vs. Easy Picsy- Best Photobooth Software Compared.jpg',
  },
  {
    title: 'How Much Does It Cost to Build a Photobooth Business in the Philippines (2025 Guide)',
    slug: 'photobooth-business-cost-philippines-2025',
    metaDescription: 'Discover how much it costs to start a photobooth business in the Philippines in 2025. Learn startup expenses, earnings, ROI, and tips to succeed.',
    seoTitle: 'How Much Does It Cost to Build a Photobooth Business in the Philippines (2025 Guide)',
    date: '2025-01-18',
    author: 'Easy Picsy Team',
    readTime: '12 min read',
    excerpt: 'Complete breakdown of photobooth business startup costs in the Philippines for 2025, including equipment, software, and expected ROI timelines.',
    thumbnail: '/blogs/How Much Does It Cost to Build a Photobooth Business in the Philippines (2025 Guide).jpg',
  },
  {
    title: 'Why Gen Z and Millennials Can’t Get Enough of Photobooths',
    slug: 'gen-z-millennials-love-photobooths',
    metaDescription: 'Gen Z and Millennials are driving the photobooth boom. Discover why younger generations love booths and how your business can capture this market.',
    seoTitle: 'Why Gen Z and Millennials Love Photobooths (And What It Means for Events)',
    date: '2025-01-22',
    author: 'Easy Picsy Team',
    readTime: '6 min read',
    excerpt: 'Understanding why Gen Z and Millennials are obsessed with photobooths and how to design your rental business to capture this growing market.',
    thumbnail: '/blogs/Why Gen Z and Millennials Can\'t Get Enough of Photobooths.jpg',
  },
];

export async function GET(request: NextRequest) {
  try {
    // Sort posts by date (newest first)
    const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json(sortedPosts);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return NextResponse.json({ error: 'Failed to load blog posts' }, { status: 500 });
  }
}