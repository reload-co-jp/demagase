import { MetadataRoute } from "next"
import { getAllArticles } from "lib/articles"

export const dynamic = "force-static"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://demagase.reload.co.jp"

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/articles/${a.id}/`,
    lastModified: a.created_at,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/articles/`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/about/`, changeFrequency: "yearly", priority: 0.5 },
    ...articleEntries,
  ]
}
