'use client';

import { ArrowRight, Camera, Globe, Instagram, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  slug: string;
  readTime: string;
  metaDescription: string;
  seoTitle: string;
  thumbnail: string;
}

export default function BlogIndexPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set page title and meta description for blog index
    document.title = 'Blog - Easy Picsy | Photobooth Business Tips & Guides';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Discover expert tips, guides, and insights for growing your photobooth business in the Philippines. Learn about software, marketing, and industry trends.'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content =
        'Discover expert tips, guides, and insights for growing your photobooth business in the Philippines. Learn about software, marketing, and industry trends.';
      document.head.appendChild(meta);
    }

    const loadBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        const posts = await response.json();
        setBlogPosts(Array.isArray(posts) ? posts : [posts]);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-easy-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* JSON-LD Structured Data for Blog Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Easy Picsy Blog',
            description:
              'Tips, guides, and insights for photobooth business owners',
            url: 'https://easypicsy.com/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Easy Picsy',
              logo: {
                '@type': 'ImageObject',
                url: 'https://easypicsy.com/logo.svg',
              },
            },
            blogPost: blogPosts.map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.metaDescription || post.excerpt,
              url: `https://easypicsy.com/blog/${post.slug}`,
              datePublished: post.date,
              author: {
                '@type': 'Person',
                name: post.author,
              },
            })),
          }),
        }}
      />

      {/* Homepage Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-50">
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

      {/* Brand Header */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-slate-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-slate-200/15 rounded-full blur-2xl"></div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-easy-yellow/20 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-easy-yellow rounded-full"></div>
              <span className="text-easy-black font-medium text-sm">
                Photobooth Business Insights
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-easy-black mb-6 leading-tight">
              Tips & Guides for
              <span className="text-easy-yellow bg-gradient-to-r from-easy-yellow to-yellow-400 bg-clip-text text-transparent block">
                Photobooth Success
              </span>
            </h1>

            <p className="text-xl text-easy-black/70 leading-relaxed max-w-3xl mx-auto">
              Expert insights, practical tips, and industry trends to help you
              build and grow a successful photobooth rental business in the
              Philippines.
            </p>
          </div>
        </div>
      </section>

      {/* Styled Blog Posts List */}
      <section className="relative pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {blogPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-easy-yellow/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-easy-yellow" />
              </div>
              <h3 className="text-xl font-semibold text-easy-black mb-2">
                No blog posts found
              </h3>
              <p className="text-easy-black/60">
                Check back soon for new content!
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Post Section - Full Width */}
              {blogPosts.length > 0 && (
                <div className="mb-12">
                  <Link
                    href={`/blog/${blogPosts[0].slug}`}
                    className="group block"
                  >
                    <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row">
                      <div className="relative lg:w-1/2">
                        {/* Featured Badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured article
                          </span>
                        </div>
                        {/* Featured Thumbnail */}
                        {blogPosts[0].thumbnail && (
                          <div className="aspect-video lg:aspect-[4/3] h-full overflow-hidden">
                            <Image
                              src={blogPosts[0].thumbnail}
                              alt={blogPosts[0].title}
                              width={800}
                              height={600}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                      </div>

                      <div className="p-8 lg:w-1/2 flex flex-col justify-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 group-hover:text-easy-black transition-colors leading-tight">
                          {blogPosts[0].title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                          {blogPosts[0].excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-gray-800 font-medium group-hover:gap-3 transition-all duration-300">
                          <span>Read More</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>
              )}

              {/* All Posts Grid - 3 Columns */}
              {blogPosts.length > 0 && (
                <div className="grid md:grid-cols-3 gap-8">
                  {blogPosts.map((post, index) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group block"
                    >
                      <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        {post.thumbnail && (
                          <div className="aspect-video overflow-hidden">
                            <Image
                              src={post.thumbnail}
                              alt={post.title}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-easy-black transition-colors leading-tight line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed mb-6 flex-1 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-gray-800 font-medium group-hover:gap-3 transition-all duration-300">
                            <span>Read More</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Waitlist CTA Section */}
      <section
        id="waitlist"
        className="relative bg-gradient-to-br from-easy-yellow-light to-easy-yellow/30 border-t border-easy-yellow/20"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-easy-yellow/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-easy-yellow/15 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
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
              Join hundreds of suppliers already using Easy Picsy to grow their
              rental business with GCash payments, real-time analytics, and
              automated workflows.
            </p>

            <a
              href="https://forms.fillout.com/t/3CDJbwoL6aus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-easy-yellow text-easy-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-easy-yellow/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Join the Waitlist
              <ArrowRight className="w-5 h-5" />
            </a>
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
