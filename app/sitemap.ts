import { MetadataRoute } from 'next'
import { fetchTopStories } from './lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fancy-hn.vercel.app'

  // Main pages
  const routes = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  // URLs for pagination
  const pageUrls = Array.from({ length: 10 }, (_, i) => ({
    url: `${baseUrl}/?page=${i + 1}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...routes, ...pageUrls]
} 