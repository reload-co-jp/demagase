import { FC } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"
import { getAllTags, getArticlesByTag } from "lib/articles"
import { absoluteUrl, ORGANIZATION, SITE_NAME, SITE_URL } from "lib/seo"
import { ArticleCard } from "components/elements/article-card"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ slug: encodeURIComponent(tag) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tag = decodeURIComponent(slug)
  const description = `「${tag}」タグの雑学・俗説検証記事一覧。出典付きでファクトチェック。`

  return {
    title: `${tag}の記事一覧`,
    description,
    alternates: { canonical: `/articles/tag/${slug}/` },
    openGraph: {
      title: `${tag}の記事一覧 | DemaGase`,
      description,
      url: `/articles/tag/${slug}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${tag}の記事一覧 | DemaGase`,
      description,
    },
  }
}

const TagPage: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const tag = decodeURIComponent(slug)
  const articles = getArticlesByTag(tag)

  if (articles.length === 0) notFound()

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tag}の記事一覧 | ${SITE_NAME}`,
    url: absoluteUrl(`/articles/tag/${slug}/`),
    description: `「${tag}」タグの雑学・俗説検証記事一覧。出典付きでファクトチェック。`,
    inLanguage: "ja-JP",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    publisher: ORGANIZATION,
    about: { "@type": "Thing", name: tag },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "記事一覧", item: `${SITE_URL}/articles/` },
      { "@type": "ListItem", position: 3, name: `${tag}の記事一覧`, item: `${SITE_URL}/articles/tag/${slug}/` },
    ],
  }

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} ${tag}の記事一覧`,
    numberOfItems: articles.length,
    publisher: ORGANIZATION,
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
        id="tag-collection-page-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageJsonLd),
        }}
      />
      <Script
        id="tag-breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="tag-item-list-json-ld"
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
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.35rem" }}>
          {tag}
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

export default TagPage
