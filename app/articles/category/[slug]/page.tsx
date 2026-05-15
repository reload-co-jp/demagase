import { FC } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllCategories, getArticlesByCategory } from "lib/articles"
import { ArticleCard } from "components/elements/article-card"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllCategories().map((cat) => ({ slug: encodeURIComponent(cat) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = decodeURIComponent(slug)
  return {
    title: `${category}の記事一覧`,
    description: `「${category}」カテゴリの雑学・俗説検証記事一覧。出典付きでファクトチェック。`,
    alternates: { canonical: `/articles/category/${slug}/` },
    openGraph: {
      title: `${category}の記事一覧 | DemaGase`,
      description: `「${category}」カテゴリの雑学・俗説検証記事一覧。出典付きでファクトチェック。`,
      url: `/articles/category/${slug}/`,
    },
  }
}

const CategoryPage: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const category = decodeURIComponent(slug)
  const articles = getArticlesByCategory(category)

  if (articles.length === 0) notFound()

  return (
    <div>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.35rem" }}>
          {category}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          {articles.length}件の検証記事
        </p>
      </div>
      <div className="dense-list">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}

export default CategoryPage
