import { FC } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Script from "next/script"
import { getAllArticles, getArticleById } from "lib/articles"
import {
  absoluteUrl,
  getSeoDescription,
  ORGANIZATION,
  SITE_NAME,
  SITE_URL,
} from "lib/seo"
import { VerdictBadge } from "components/elements/verdict-badge"
import { ArticleCard } from "components/elements/article-card"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((a) => ({ id: a.id }))
}

const verdictRatingMap = {
  false: 1,
  partial: 2,
  unconfirmed: 3,
  unknown: 3,
  true: 5,
} as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const article = getArticleById(id)
  if (!article) return {}
  const description = getSeoDescription(article.explanation)
  return {
    title: article.title,
    description,
    keywords: [article.category, ...article.tags],
    alternates: { canonical: `/articles/${id}/` },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url: `/articles/${id}/`,
      publishedTime: article.created_at,
      modifiedTime: article.created_at,
      section: article.category,
      tags: article.tags,
      images: [
        {
          url: `/articles/${id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [`/articles/${id}/opengraph-image`],
    },
  }
}

const Section: FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <section style={{ marginBottom: "2rem" }}>
    <h2
      style={{
        fontSize: "0.75rem",
        fontWeight: 700,
        color: "var(--muted)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: "0.625rem",
      }}
    >
      {label}
    </h2>
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "1.25rem",
        color: "var(--text)",
        lineHeight: 1.8,
      }}
    >
      {children}
    </div>
  </section>
)

const ArticleDetailPage: FC<Props> = async ({ params }) => {
  const { id } = await params
  const article = getArticleById(id)
  if (!article) notFound()

  const allArticles = getAllArticles()
  const related = allArticles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3)
  const articleUrl = absoluteUrl(`/articles/${article.id}/`)
  const description = getSeoDescription(article.explanation)

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    headline: article.title,
    description,
    image: absoluteUrl(`/articles/${article.id}/opengraph-image`),
    datePublished: article.created_at,
    dateModified: article.created_at,
    url: articleUrl,
    inLanguage: "ja-JP",
    author: ORGANIZATION,
    publisher: ORGANIZATION,
    articleSection: article.category,
    keywords: [article.category, ...article.tags].join(", "),
    about: { "@type": "Thing", name: article.category },
    mentions: article.tags.map((tag) => ({ "@type": "Thing", name: tag })),
    citation: article.sources
      .filter((source) => source.url)
      .map((source) => ({
        "@type": "CreativeWork",
        name: source.title,
        url: source.url,
        author: source.author,
      })),
    isAccessibleForFree: true,
    articleBody: [
      article.claim,
      article.explanation,
      article.truth,
      article.why_spread,
      article.how_to_identify,
    ].join("\n\n"),
  }

  const claimReviewJsonLd = {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    url: articleUrl,
    datePublished: article.created_at,
    claimReviewed: article.claim,
    author: ORGANIZATION,
    publisher: ORGANIZATION,
    reviewBody: article.explanation,
    itemReviewed: {
      "@type": "Claim",
      appearance: article.sources
        .filter((source) => source.url)
        .map((source) => ({
          "@type": "CreativeWork",
          name: source.title,
          url: source.url,
        })),
      claimInterpreter: ORGANIZATION,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: verdictRatingMap[article.verdict],
      bestRating: 5,
      worstRating: 1,
      alternateName: article.verdict_label,
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "記事一覧",
        item: `${SITE_URL}/articles/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  }

  const relatedItemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} 関連記事`,
    itemListElement: related.map((a, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/articles/${a.id}/`),
      name: a.title,
    })),
  }

  return (
    <article style={{ maxWidth: "920px", margin: "0 auto" }}>
      <Script
        id="article-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="claimreview-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(claimReviewJsonLd) }}
      />
      <Script
        id="breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {related.length > 0 && (
        <Script
          id="related-item-list-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(relatedItemListJsonLd),
          }}
        />
      )}
      {/* Breadcrumb */}
      <nav
        style={{
          fontSize: "0.8125rem",
          color: "var(--muted)",
          marginBottom: "1.5rem",
        }}
      >
        <Link href="/">ホーム</Link>
        <span style={{ margin: "0 0.5rem" }}>/</span>
        <Link href="/articles/">記事一覧</Link>
        <span style={{ margin: "0 0.5rem" }}>/</span>
        <span>{article.title}</span>
      </nav>

      {/* Header */}
      <header style={{ marginBottom: "2.5rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <VerdictBadge verdict={article.verdict} size="lg" />
        </div>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            lineHeight: 1.35,
            marginBottom: "1rem",
          }}
        >
          {article.title}
        </h1>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Link
            href={`/articles/category/${encodeURIComponent(article.category)}/`}
            style={{
              fontSize: "0.8125rem",
              color: "var(--accent)",
              background: "rgba(88,166,255,0.1)",
              padding: "0.2rem 0.625rem",
              borderRadius: "100px",
              textDecoration: "none",
            }}
          >
            {article.category}
          </Link>
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/articles/tag/${encodeURIComponent(tag)}/`}
              className="tag"
              style={{ textDecoration: "none" }}
            >
              {tag}
            </Link>
          ))}
          <time
            dateTime={article.created_at}
            style={{
              fontSize: "0.8125rem",
              color: "var(--muted)",
              marginLeft: "auto",
            }}
          >
            {article.created_at}
          </time>
        </div>
      </header>

      {/* Claim */}
      <Section label="よくある説（俗説）">
        <p style={{ fontWeight: 600 }}>{article.claim}</p>
        <p style={{ marginTop: "0.5rem", color: "var(--muted)" }}>
          {article.common_belief}
        </p>
      </Section>

      {/* Verdict detail */}
      <Section label="検証">
        <p>{article.explanation}</p>
      </Section>

      {/* Truth */}
      <Section label="実際の有力説">
        <p>{article.truth}</p>
      </Section>

      {/* Why spread */}
      <Section label="なぜ広まったか">
        <p>{article.why_spread}</p>
      </Section>

      {/* How to identify */}
      <Section label="見分け方">
        <p>{article.how_to_identify}</p>
      </Section>

      {/* Sources */}
      {article.sources.length > 0 && (
        <Section label="出典">
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {article.sources.map((s, i) => (
              <li key={i} style={{ fontSize: "0.875rem" }}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.title}
                  </a>
                ) : (
                  <span>{s.title}</span>
                )}
                {s.author && (
                  <span style={{ color: "var(--muted)", marginLeft: "0.5rem" }}>
                    — {s.author}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section style={{ marginTop: "3rem" }}>
          <h2 className="section-title">関連記事</h2>
          <div className="grid-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

export default ArticleDetailPage
