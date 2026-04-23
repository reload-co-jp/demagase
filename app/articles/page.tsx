import { FC } from "react"
import { getAllArticles, getAllCategories } from "lib/articles"
import { ArticleListClient } from "components/features/article-list-client"

export const metadata = {
  title: "記事一覧",
  description: "雑学・トリビアのデマ検証記事の一覧。カテゴリやタグで絞り込めます。",
  alternates: { canonical: "/articles/" },
  openGraph: {
    title: "記事一覧",
    description: "雑学・トリビアのデマ検証記事の一覧。カテゴリやタグで絞り込めます。",
    url: "/articles/",
  },
}

const ArticlesPage: FC = () => {
  const articles = getAllArticles()
  const categories = getAllCategories()

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.75rem" }}>記事一覧</h1>
      <ArticleListClient articles={articles} categories={categories} />
    </div>
  )
}

export default ArticlesPage
