import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://echoyou-paperino.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/admin/',
        '/api/',
        '/onboarding/',
        '/uploads/',
        '/r/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
