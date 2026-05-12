import { FC } from "react"
import type { Metadata } from "next"
import { getAllArticles, getAllCategories } from "lib/articles"
import { ArticleListClient } from "components/features/article-list-client"

export const metadata: Metadata = {
  title: "記事一覧",
  description: "雑学・トリビアのデマ検証記事の一覧。カテゴリやタグで絞り込めます。",
  alternates: { canonical: "/articles/" },
  openGraph: {
    title: "記事一覧",
    description: "雑学・トリビアのデマ検証記事の一覧。カテゴリやタグで絞り込めます。",
    url: "/articles/",
  },
  twitter: {
    card: "summary_large_image",
    title: "記事一覧 | DemaGase",
    description: "雑学・トリビアのデマ検証記事の一覧。カテゴリやタグで絞り込めます。",
  },
}

const ArticlesPage: FC = () => {
  const articles = getAllArticles()
  const categories = getAllCategories()

  return (
    <div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1rem", marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.35rem" }}>記事一覧</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>新着順で雑学デマ検証記事を一覧表示。</p>
      </div>
      <ArticleListClient articles={articles} categories={categories} />
    </div>
  )
}

export default ArticlesPage
