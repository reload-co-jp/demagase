import { Suspense } from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { getAllArticles, getAllCategories } from "lib/articles"
import { absoluteUrl, SITE_NAME, SITE_URL } from "lib/seo"
import { ArticleListClient } from "components/features/article-list-client"

export const metadata: Metadata = {
  title: "記事一覧",
  description:
    "雑学・トリビアのデマ検証記事の一覧。カテゴリやタグで絞り込めます。",
  alternates: { canonical: "/articles/" },
  openGraph: {
    title: "記事一覧",
    description:
      "雑学・トリビアのデマ検証記事の一覧。カテゴリやタグで絞り込めます。",
    url: "/articles/",
  },
  twitter: {
    card: "summary_large_image",
    title: "記事一覧 | DemaGase",
    description:
      "雑学・トリビアのデマ検証記事の一覧。カテゴリやタグで絞り込めます。",
  },
}

const ArticlesPage = () => {
  const articles = getAllArticles()
  const categories = getAllCategories()
  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${SITE_NAME} 記事一覧`,
    url: absoluteUrl("/articles/"),
    description:
      "雑学・トリビアのデマ検証記事の一覧。カテゴリやタグで絞り込めます。",
    inLanguage: "ja-JP",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  }
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "記事一覧", item: `${SITE_URL}/articles/` },
    ],
  }

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} 記事一覧`,
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/articles/${article.id}/`),
      name: article.title,
    })),
  }

  return (
    <div>
      <Script
        id="articles-collection-page-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      <Script
        id="articles-breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="articles-item-list-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.4rem",
            fontWeight: 800,
            marginBottom: "0.35rem",
          }}
        >
          記事一覧
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          新着順で雑学デマ検証記事を一覧表示。
        </p>
      </div>
      <Suspense fallback={null}>
        <ArticleListClient articles={articles} categories={categories} />
      </Suspense>
    </div>
  )
}

export default ArticlesPage
