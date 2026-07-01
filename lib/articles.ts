import { Article } from "types/article"
import articlesData from "data/articles.json"

const articles: Article[] = (articlesData as Article[]).sort(
  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
)

export function getAllArticles(): Article[] {
  return articles
}

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id)
}

export function getAllCategories(): string[] {
  return [...new Set(getAllArticles().map((a) => a.category))]
}

export function getAllTags(): string[] {
  return [...new Set(getAllArticles().flatMap((a) => a.tags))]
}

export function getTagsByFrequency(): string[] {
  const counts = new Map<string, number>()

  getAllArticles().forEach((article) => {
    article.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    })
  })

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"))
    .map(([tag]) => tag)
}

export function getLatestArticleDate(): Date {
  const [latest] = getAllArticles()
  return latest ? new Date(latest.created_at) : new Date()
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter((a) => a.category === category)
}

export function getArticlesByTag(tag: string): Article[] {
  return getAllArticles().filter((a) => a.tags.includes(tag))
}
