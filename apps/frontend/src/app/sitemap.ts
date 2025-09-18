import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.easypicsybooths.com'
  
  // Static pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Blog posts
  const blogPosts = [
    {
      slug: 'dslrbooth-lumabooth-easy-picsy-comparison',
      date: '2025-01-20',
    },
    {
      slug: 'photobooth-business-cost-philippines-2025',
      date: '2025-01-18',
    },
    {
      slug: 'gen-z-millennials-love-photobooths',
      date: '2025-01-22',
    },
  ]

  const blogRoutes = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...blogRoutes]
}