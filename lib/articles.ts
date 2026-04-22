import fs from "fs"
import path from "path"
import { Article } from "types/article"

const articlesDir = path.join(process.cwd(), "data/articles")

export function getAllArticles(): Article[] {
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".json"))
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(articlesDir, f), "utf8")) as Article)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getArticleById(id: string): Article | undefined {
  try {
    const content = fs.readFileSync(path.join(articlesDir, `${id}.json`), "utf8")
    return JSON.parse(content) as Article
  } catch {
    return undefined
  }
}

export function getAllCategories(): string[] {
  return [...new Set(getAllArticles().map((a) => a.category))]
}

export function getAllTags(): string[] {
  return [...new Set(getAllArticles().flatMap((a) => a.tags))]
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter((a) => a.category === category)
}

export function getArticlesByTag(tag: string): Article[] {
  return getAllArticles().filter((a) => a.tags.includes(tag))
}
