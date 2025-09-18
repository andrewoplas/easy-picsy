'use client';

import { Camera, Calendar, User, Clock, ArrowLeft, ArrowRight, Globe, Mail, Instagram } from 'lucide-react';
import PhotoboothBusinessCostPost from '@/components/blog/PhotoboothBusinessCostPost';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  slug: string;
  content: string;
  readTime: string;
  metaDescription: string;
  seoTitle: string;
  thumbnail?: string;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.slug}`);
        if (response.ok) {
          const post = await response.json();
          setBlogPost(post);
          
          // Update page title and meta description
          document.title = post.seoTitle || post.title;
          
          // Update meta description
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', post.metaDescription || post.excerpt);
          } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = post.metaDescription || post.excerpt;
            document.head.appendChild(meta);
          }
        }
      } catch (error) {
        console.error('Failed to load blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-easy-yellow-light to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-easy-yellow"></div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-easy-yellow-light to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-easy-yellow/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Camera className="w-8 h-8 text-easy-yellow" />
          </div>
          <h1 className="text-2xl font-bold text-easy-black mb-4">Blog Post Not Found</h1>
          <Link href="/blog" className="inline-flex items-center gap-2 text-easy-yellow hover:text-easy-yellow/80 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            View All Blog Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": blogPost.title,
            "description": blogPost.metaDescription || blogPost.excerpt,
            "author": {
              "@type": "Person",
              "name": blogPost.author,
            },
            "publisher": {
              "@type": "Organization",
              "name": "Easy Picsy",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.easypicsybooths.com/logo.svg",
              },
            },
            "datePublished": blogPost.date,
            "dateModified": blogPost.date,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://www.easypicsybooths.com/blog/${blogPost.slug}`,
            },
          }),
        }}
      />

      {/* Homepage Navigation */}
      <nav
        className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-50"
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/logo.svg"
                  alt="Easy Picsy"
                  width={120}
                  height={32}
                  className="h-8 w-auto transition-all duration-300 cursor-pointer"
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/#why-easy-picsy"
                className="text-gray-600 hover:text-easy-black transition-colors text-sm font-medium"
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="text-gray-600 hover:text-easy-black transition-colors text-sm font-medium"
              >
                How it Works
              </Link>
              <Link
                href="/blog"
                className="text-gray-600 hover:text-easy-black transition-colors text-sm font-medium"
              >
                Blog
              </Link>
              <Link
                href="/#waitlist"
                className="bg-easy-yellow text-easy-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-easy-yellow/90 transition-all duration-300"
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Brand Hero Section */}
      <section className="relative pt-40 pb-12 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-slate-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-slate-200/15 rounded-full blur-2xl"></div>
        
        <div className="relative max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-easy-black/60 mb-8">
            <Link href="/" className="hover:text-easy-black transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-easy-black transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-easy-black/80">{blogPost.title.substring(0, 30)}...</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-easy-black mb-8 leading-tight">
            {blogPost.title}
          </h1>
          
          {/* Blog Post Thumbnail */}
          {blogPost.thumbnail && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={blogPost.thumbnail}
                alt={blogPost.title}
                width={1200}
                height={600}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          )}
          
          {/* Meta Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/20 shadow-sm">
            <div className="flex flex-wrap items-center gap-6 text-sm text-easy-black/70">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{blogPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blogPost.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blogPost.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Styled Blog Content */}
      <section className="relative pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <article className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200/10">
            {/* Conditionally render React component or HTML content */}
            {blogPost.slug === 'photobooth-business-cost-philippines-2025' ? (
              <PhotoboothBusinessCostPost />
            ) : (
              <div 
                className="prose prose-lg max-w-none
                prose-headings:text-easy-black prose-headings:font-bold prose-headings:leading-snug
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-12 prose-h1:font-bold prose-h1:border-b prose-h1:border-easy-yellow/20 prose-h1:pb-3
                prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h2:font-bold prose-h2:text-easy-black
                prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-8 prose-h3:font-semibold prose-h3:text-easy-black
                prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-6 prose-h4:font-semibold prose-h4:text-easy-black
                prose-h5:text-base prose-h5:mb-2 prose-h5:mt-4 prose-h5:font-semibold prose-h5:text-easy-black
                prose-p:text-easy-black/80 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                prose-a:text-easy-yellow prose-a:font-medium hover:prose-a:text-easy-yellow/80 prose-a:no-underline hover:prose-a:underline prose-a:transition-colors
                prose-strong:text-easy-black prose-strong:font-semibold
                prose-ul:text-easy-black/80 prose-ul:mb-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:text-easy-black/80 prose-ol:mb-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:mb-2 prose-li:leading-relaxed prose-li:text-lg
                prose-blockquote:border-l-4 prose-blockquote:border-easy-yellow prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-easy-black/70 prose-blockquote:bg-easy-yellow-light/50 prose-blockquote:py-4 prose-blockquote:rounded-r-lg
                prose-table:border-collapse prose-table:w-full prose-table:mb-6 prose-table:text-sm prose-table:border prose-table:border-easy-yellow/20 prose-table:rounded-lg prose-table:overflow-hidden
                prose-th:bg-easy-yellow-light prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-easy-yellow/20 prose-th:text-easy-black
                prose-td:p-4 prose-td:border prose-td:border-easy-yellow/20 prose-td:text-easy-black/80
                prose-code:bg-easy-yellow-light prose-code:px-3 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:text-easy-black prose-code:border prose-code:border-easy-yellow/20
                prose-pre:bg-easy-black prose-pre:text-white prose-pre:p-6 prose-pre:rounded-xl prose-pre:border prose-pre:border-easy-yellow/20
                prose-hr:border-easy-yellow/30 prose-hr:my-12
                "
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
            )}
          </article>
        </div>
      </section>

      {/* Waitlist CTA Section */}
      <section id="waitlist" className="relative bg-gradient-to-br from-slate-50 to-slate-100/30 border-t border-slate-200/20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-slate-200/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-slate-200/15 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Icon */}
            <div className="w-16 h-16 bg-easy-yellow rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Camera className="w-8 h-8 text-easy-black" />
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-easy-black mb-4">
              Ready to Transform Your
              <span className="text-easy-yellow bg-gradient-to-r from-easy-yellow to-yellow-400 bg-clip-text text-transparent block">
                Photobooth Business?
              </span>
            </h3>
            
            <p className="text-easy-black/70 text-lg mb-8 leading-relaxed">
              Join hundreds of suppliers already using Easy Picsy to grow their rental business with GCash payments, real-time analytics, and automated workflows.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://forms.fillout.com/t/3CDJbwoL6aus"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-easy-yellow text-easy-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-easy-yellow/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Join the Waitlist
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-easy-black/70 hover:text-easy-black px-8 py-4 font-medium transition-colors rounded-2xl border border-easy-yellow/20 hover:border-easy-yellow/40 bg-white/50 hover:bg-white/80"
              >
                Read More Articles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-easy-black text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="mb-4">
              <Image
                src="/logo.svg"
                alt="Easy Picsy"
                width={120}
                height={32}
                className="h-8 w-auto brightness-0 invert mx-auto transition-all duration-300"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Made for owners. Loved by guests.
            </p>
            <div className="flex justify-center space-x-6 mb-4">
              <a
                href="https://instagram.com/easypicsybooths"
                className="text-gray-400 hover:text-easy-yellow transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://easypicsybooths.com"
                className="text-gray-400 hover:text-easy-yellow transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@easypicsybooths.com"
                className="text-gray-400 hover:text-easy-yellow transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-gray-500">
              &copy; 2025 Easy Picsy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}