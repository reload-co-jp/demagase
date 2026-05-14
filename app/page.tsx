import { FC } from "react"
import Link from "next/link"
import type { Metadata } from "next"
import Script from "next/script"
import { getAllArticles, getAllCategories } from "lib/articles"
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "lib/seo"
import { ArticleCard } from "components/elements/article-card"
import { TodayArticle } from "components/features/today-article"

export const metadata: Metadata = {
  title: "DemaGase｜雑学デマ検証サイト",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "DemaGase｜雑学デマ検証サイト",
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "DemaGase｜雑学デマ検証サイト",
    description: SITE_DESCRIPTION,
  },
}

const VERDICTS = [
  { icon: "❌", label: "誤り", desc: "根拠がなく、誤りと断定できる" },
  {
    icon: "⚠️",
    label: "一部誤り",
    desc: "部分的に正しいが、全体として誤解を招く",
  },
  {
    icon: "🤔",
    label: "有力説だが確定ではない",
    desc: "有力な説だが、確定的な証拠がない",
  },
  { icon: "⭕", label: "正しい", desc: "根拠に基づいて正しいと言える" },
  { icon: "❓", label: "不明", desc: "情報が不足しており判断できない" },
]

const Page: FC = () => {
  const articles = getAllArticles()
  const categories = getAllCategories()
  const newArticles = articles.slice(0, 12)
  const featuredCategories = categories.slice(0, 10)
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} 新着記事`,
    itemListElement: newArticles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/articles/${article.id}/`),
      name: article.title,
    })),
  }

  return (
    <div className="bookmark-shell">
      <Script
        id="home-item-list-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div style={{ minWidth: 0 }}>
        <section
          style={{
            marginBottom: "1rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "1rem",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              marginBottom: "0.4rem",
            }}
          >
            DemaGase
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            雑学・語源・俗説を出典ベースで検証する読み物サイト。
          </p>
        </section>

        <section style={{ marginBottom: "1rem" }}>
          <h2 className="section-title">注目記事</h2>
          <TodayArticle articles={articles} />
        </section>

        <section>
          <h2 className="section-title">新着エントリー</h2>
          <div className="dense-list">
            {newArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </div>

      <aside
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          position: "sticky",
          top: "1rem",
        }}
      >
        <section
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "0.9rem",
          }}
        >
          <h2
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            カテゴリ
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            {featuredCategories.map((cat) => (
              <Link
                key={cat}
                href={`/articles/?category=${encodeURIComponent(cat)}`}
                style={{
                  color: "var(--text)",
                  fontSize: "0.84rem",
                  padding: "0.35rem 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {cat}
              </Link>
            ))}
          </div>
          <div style={{ marginTop: "0.75rem" }}>
            <Link href="/articles/" className="btn">
              記事一覧へ
            </Link>
          </div>
        </section>

        <section
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "0.9rem",
          }}
        >
          <h2
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            判定ラベル
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}
          >
            {VERDICTS.map((v) => (
              <div
                key={v.label}
                style={{
                  display: "flex",
                  gap: "0.65rem",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "var(--accent-secondary)",
                    minWidth: "2.2rem",
                  }}
                >
                  {v.label}
                </span>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--muted)",
                    lineHeight: 1.55,
                  }}
                >
                  {v.desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "0.9rem",
          }}
        >
          <h2
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            人気タグ
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            {articles
              .flatMap((article) => article.tags)
              .slice(0, 18)
              .map((tag, index) => (
                <span key={`${tag}-${index}`} className="tag">
                  {tag}
                </span>
              ))}
          </div>
        </section>
      </aside>
    </div>
  )
}

export default Page
