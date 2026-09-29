import { FC } from "react"
import Link from "next/link"
import { JsonLd } from "components/elements/json-ld"
import type { Metadata } from "next"
import { getAllArticles, getAllCategories, getTagsByFrequency } from "lib/articles"
import {
  absoluteUrl,
  collectionPath,
  SITE_DESCRIPTION,
  SITE_NAME,
  verdictPath,
} from "lib/seo"
import { COLLECTIONS, VERDICT_INFO, VERDICTS } from "lib/taxonomy"
import { ArticleCard } from "components/elements/article-card"
import { TodayArticle } from "components/features/today-article"

export const metadata: Metadata = {
  title: { absolute: "DemaGase｜雑学デマ検証サイト" },
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

const Page: FC = () => {
  const articles = getAllArticles()
  const categories = getAllCategories()
  const popularTags = getTagsByFrequency()
  const newArticles = articles.slice(0, 12)
  const featuredCategories = categories.slice(0, 10)
  const homePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "DemaGase",
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    inLanguage: "ja-JP",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
    about: featuredCategories.map((category) => ({
      "@type": "Thing",
      name: category,
    })),
  }
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
      <JsonLd data={homePageJsonLd} />
      <JsonLd data={itemListJsonLd} />
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
          <p style={{ fontSize: "0.9rem", lineHeight: 1.8 }}>
            DemaGase（デマガセ）は、雑学・語源・健康・歴史などの「よく聞くけれど本当？」という俗説を、官公庁・研究機関・辞書などの出典をもとに検証するサイトです。
            「○○は本当？」「○○はなぜ？」と気になった説について、結論と判定を記事の冒頭で示し、よくある説、検証、実際の有力説、広まった理由、見分け方の順に整理しています。
          </p>
        </section>

        <section style={{ marginBottom: "1rem" }}>
          <h2 className="section-title">テーマ別まとめ</h2>
          <ul style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem" }}>
            {COLLECTIONS.map((c) => (
              <li key={c.slug}>
                <Link href={collectionPath(c.slug)}>{c.title}</Link>
              </li>
            ))}
          </ul>
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
                href={`/articles/category/${encodeURIComponent(cat)}/`}
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
                key={v}
                style={{
                  display: "flex",
                  gap: "0.65rem",
                  alignItems: "flex-start",
                }}
              >
                <Link
                  href={verdictPath(v)}
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "var(--accent-secondary)",
                    minWidth: "2.2rem",
                  }}
                >
                  {VERDICT_INFO[v].label}
                </Link>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--muted)",
                    lineHeight: 1.55,
                  }}
                >
                  {VERDICT_INFO[v].description}
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
            {popularTags
              .slice(0, 18)
              .map((tag) => (
                <Link
                  key={tag}
                  href={`/articles/tag/${encodeURIComponent(tag)}/`}
                  className="tag"
                  style={{ textDecoration: "none" }}
                >
                  {tag}
                </Link>
              ))}
          </div>
        </section>
      </aside>
    </div>
  )
}

export default Page
