import { MetadataRoute } from "next"
import { getAllArticles, getAllCategories, getAllTags } from "lib/articles"
import { SITE_URL } from "lib/seo"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const categories = getAllCategories()
  const tags = getAllTags()

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/articles/${a.id}/`,
    lastModified: new Date(a.created_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/articles/category/${encodeURIComponent(cat)}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${SITE_URL}/articles/tag/${encodeURIComponent(tag)}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
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
    ...categoryEntries,
    ...tagEntries,
    ...articleEntries,
  ]
}
