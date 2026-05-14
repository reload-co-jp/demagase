import { MetadataRoute } from "next"
import { getAllArticles } from "lib/articles"
import { SITE_URL } from "lib/seo"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/articles/${a.id}/`,
    lastModified: a.created_at,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/articles/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: `${SITE_URL}/about/`, changeFrequency: "yearly", priority: 0.5 },
    ...articleEntries,
  ]
}
