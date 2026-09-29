import { Article, Faq, Verdict } from "types/article"
import {
  Collection,
  COLLECTIONS,
  MIN_INDEXABLE_ARTICLES,
  TAG_DESCRIPTIONS,
} from "lib/taxonomy"
import articlesData from "data/articles.json"

const articles: Article[] = (articlesData as Article[]).sort(
  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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

export function getArticlesByVerdict(verdict: Verdict): Article[] {
  return getAllArticles().filter((a) => a.verdict === verdict)
}

export function getArticlesByCollection(collection: Collection): Article[] {
  return getAllArticles().filter(
    (a) =>
      collection.categories.includes(a.category) ||
      a.tags.some((tag) => collection.tags.includes(tag))
  )
}

export function getCollectionsForArticle(article: Article): Collection[] {
  return COLLECTIONS.filter((c) =>
    getArticlesByCollection(c).some((a) => a.id === article.id)
  )
}

export function isTagIndexable(tag: string): boolean {
  return (
    tag in TAG_DESCRIPTIONS &&
    getArticlesByTag(tag).length >= MIN_INDEXABLE_ARTICLES
  )
}

export function isCategoryIndexable(category: string): boolean {
  return getArticlesByCategory(category).length >= MIN_INDEXABLE_ARTICLES
}

/** 記事群によく付いているタグ（除外指定以外）を頻度順で返す */
export function getRelatedTags(articles: Article[], exclude: string[] = []) {
  const counts = new Map<string, number>()
  articles.forEach((a) =>
    a.tags.forEach((tag) => {
      if (!exclude.includes(tag)) counts.set(tag, (counts.get(tag) ?? 0) + 1)
    })
  )
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"))
    .map(([tag]) => tag)
}

/** カテゴリ・タグ・キーワードの一致度で関連記事を選ぶ */
export function getRelatedArticles(article: Article, limit = 6): Article[] {
  return getAllArticles()
    .filter((a) => a.id !== article.id)
    .map((a) => {
      const sharedTags = a.tags.filter((tag) => article.tags.includes(tag))
      const keywordHits = article.tags.filter(
        (tag) =>
          !sharedTags.includes(tag) && `${a.title}${a.claim}`.includes(tag)
      )
      const score =
        sharedTags.length * 2 +
        keywordHits.length +
        (a.category === article.category ? 3 : 0)
      return { a, score }
    })
    .filter(({ score }) => score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map(({ a }) => a)
}

export function getUpdatedAt(article: Article): string {
  return article.updated_at ?? article.created_at
}

export function firstSentence(text: string): string {
  const match = text.match(/^.+?。/)
  return match ? match[0] : text
}

/** 「○○は本当か？」の○○部分 */
export function getSubject(article: Article): string {
  return article.title.replace(/(は本当)?か？$|？$/, "")
}

export function getConclusion(article: Article): string {
  return `${getSubject(article)}という説の判定は「${article.verdict_label}」。${firstSentence(article.truth)}`
}

/** 本文の各セクションから検索意図に沿ったFAQを作る（ページ上に表示する前提） */
export function getFaqs(article: Article): Faq[] {
  const subject = getSubject(article)
  return [
    {
      question: article.title.endsWith("は本当か？")
        ? `${subject}は本当？`
        : article.title,
      answer: `「${article.verdict_label}」です。${firstSentence(article.explanation)}`,
    },
    {
      question: `${subject}という説の真相は？`,
      answer: firstSentence(article.truth),
    },
    {
      question: `${subject}という説はなぜ広まった？`,
      answer: firstSentence(article.why_spread),
    },
    {
      question: "似た俗説を見分けるには？",
      answer: firstSentence(article.how_to_identify),
    },
    ...(article.faq ?? []),
  ]
}
