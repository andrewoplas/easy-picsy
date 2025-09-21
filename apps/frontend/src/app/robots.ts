import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/private/',
          '/_next/',
          '/static/',
          '/site.webmanifest',
          '/*.webmanifest',
        ],
      },
    ],
    sitemap: 'https://www.easypicsybooths.com/sitemap.xml',
  }
}