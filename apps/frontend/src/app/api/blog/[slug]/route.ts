import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';

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
    thumbnail: '/blogs/DSLRBooth vs. LumaBooth vs. Easy Picsy- Best Photobooth Software Compared.jpg',
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
    thumbnail: '/blogs/How Much Does It Cost to Build a Photobooth Business in the Philippines (2025 Guide).jpg',
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
    thumbnail: '/blogs/Why Gen Z and Millennials Can\'t Get Enough of Photobooths.jpg',
  },
};

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    
    // Check if the blog post exists in our metadata
    const postMetadata = blogPosts[slug];
    if (!postMetadata) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Map file names to slugs
    const fileMap: Record<string, string> = {
      'dslrbooth-lumabooth-easy-picsy-comparison': 'DSLRBooth vs. LumaBooth vs. Easy Picsy: Best Photobooth Software Compared.md',
      'photobooth-business-cost-philippines-2025': 'How Much Does It Cost to Build a Photobooth Business in the Philippines (2025 Guide).md',
      'gen-z-millennials-love-photobooths': 'Why Gen Z and Millennials Can\'t Get Enough of Photobooths.md',
    };

    const fileName = fileMap[slug];
    if (!fileName) {
      return NextResponse.json({ error: 'Blog post file not found' }, { status: 404 });
    }

    // Read the markdown file from public/blogs directory
    const blogPostPath = join(process.cwd(), 'public', 'blogs', fileName);
    
    
    if (!existsSync(blogPostPath)) {
      return NextResponse.json({ error: `Blog post file does not exist at: ${blogPostPath}` }, { status: 404 });
    }

    const fileContent = readFileSync(blogPostPath, 'utf8');
    
    // Extract content after the metadata section
    let contentMarkdown = fileContent;
    
    // Configure marked options for better formatting
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    
    // For the photobooth business cost post, return empty content since it's handled by React component
    if (slug === 'photobooth-business-cost-philippines-2025') {
      const htmlContent = '<p>This content is rendered by a React component.</p>';
      
      const blogPost = {
        ...postMetadata,
        content: htmlContent
      };
      
      return NextResponse.json(blogPost);
    }
    
    // Remove the metadata section for different post formats
    if (slug === 'dslrbooth-lumabooth-easy-picsy-comparison') {
      // Remove everything before the first # heading
      const firstHeading = fileContent.indexOf('# ');
      if (firstHeading !== -1) {
        contentMarkdown = fileContent.substring(firstHeading);
      }
    } else if (slug === 'gen-z-millennials-love-photobooths') {
      // Remove everything before "Content:" section
      const contentStart = fileContent.indexOf('**Content:**');
      if (contentStart !== -1) {
        const afterContent = fileContent.substring(contentStart + '**Content:**'.length).trim();
        contentMarkdown = afterContent;
      }
    }
    
    // Clean up the markdown content and handle special formatting
    contentMarkdown = contentMarkdown
      .replace(/\\\[/g, '[') // Fix escaped brackets
      .replace(/\\\]/g, ']') // Fix escaped brackets  
      .replace(/\\\(/g, '(') // Fix escaped parentheses
      .replace(/\\\)/g, ')') // Fix escaped parentheses
      .replace(/\\n/g, '\n') // Fix escaped newlines
      // Format tips
      .replace(/💡\s*([^💡\n]+?)(?=\n|$)/g, '💡 **$1**') // Format tips
      .replace(/\*\*([^*]+):\*\*/g, '**$1:**') // Fix bold with colon
      .replace(/\n\n\n+/g, '\n\n') // Remove excessive line breaks
      .replace(/–/g, '–') // Ensure proper em dash
      .trim();
    
    // Fix SEO: Convert H1 tags to H2 tags since we already have an H1 in the page title
    // This ensures proper heading hierarchy for SEO
    contentMarkdown = contentMarkdown
      .replace(/^# /gm, '## ') // Convert H1 to H2
      .replace(/^## /gm, '### ') // Convert H2 to H3  
      .replace(/^### /gm, '#### ') // Convert H3 to H4
      // Fix the first heading back to H2 (since we converted H1 to H2)
      .replace(/^### /, '## ');
    
    // Convert markdown to HTML
    const htmlContent = marked(contentMarkdown);
    
    const blogPost = {
      ...postMetadata,
      content: htmlContent
    };
    
    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error loading blog post:', error);
    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
  }
}