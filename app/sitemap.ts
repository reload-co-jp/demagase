import { MetadataRoute } from "next"
import {
  getAllArticles,
  getAllCategories,
  getAllTags,
  getArticlesByCollection,
  getArticlesByVerdict,
  getLatestArticleDate,
  getUpdatedAt,
  isCategoryIndexable,
  isTagIndexable,
} from "lib/articles"
import { COLLECTIONS, MIN_INDEXABLE_ARTICLES, VERDICTS } from "lib/taxonomy"
import { SITE_URL } from "lib/seo"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  // noindex のページはサイトマップに含めない
  const categories = getAllCategories().filter(isCategoryIndexable)
  const tags = getAllTags().filter(isTagIndexable)
  const collections = COLLECTIONS.filter(
    (c) => getArticlesByCollection(c).length >= MIN_INDEXABLE_ARTICLES
  )
  const verdicts = VERDICTS.filter((v) => getArticlesByVerdict(v).length > 0)
  const latestArticleDate = getLatestArticleDate()

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/articles/${a.id}/`,
    lastModified: new Date(getUpdatedAt(a)),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/articles/category/${encodeURIComponent(cat)}/`,
    lastModified: latestArticleDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${SITE_URL}/articles/tag/${encodeURIComponent(tag)}/`,
    lastModified: latestArticleDate,
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  const collectionEntries: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${SITE_URL}/collections/${c.slug}/`,
    lastModified: latestArticleDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const verdictEntries: MetadataRoute.Sitemap = verdicts.map((v) => ({
    url: `${SITE_URL}/verification/${v}/`,
    lastModified: latestArticleDate,
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: latestArticleDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/articles/`,
      lastModified: latestArticleDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: `${SITE_URL}/about/`, changeFrequency: "yearly", priority: 0.5 },
    ...collectionEntries,
    ...categoryEntries,
    ...verdictEntries,
    ...tagEntries,
    ...articleEntries,
  ]
}
