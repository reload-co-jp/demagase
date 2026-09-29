import { FC } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Article } from "types/article"
import Link from "next/link"
import {
  getAllArticles,
  getArticleById,
  getCollectionsForArticle,
  getConclusion,
  getFaqs,
  getRelatedArticles,
  getUpdatedAt,
} from "lib/articles"
import { VERDICT_INFO } from "lib/taxonomy"
import {
  absoluteUrl,
  categoryPath,
  collectionPath,
  getSeoDescription,
  ORGANIZATION,
  SITE_NAME,
  verdictPath,
} from "lib/seo"
import { VerdictBadge } from "components/elements/verdict-badge"
import { ArticleCard } from "components/elements/article-card"
import { Breadcrumb } from "components/elements/breadcrumb"
import { JsonLd } from "components/elements/json-ld"
import { TagList } from "components/elements/tag-list"

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
  const description = getArticleDescription(article)
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
      modifiedTime: getUpdatedAt(article),
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

function getArticleDescription(article: Article): string {
  return getSeoDescription(
    `${getConclusion(article)}${article.explanation}`,
    120
  )
}

const DEFAULT_AUTHOR = `${SITE_NAME}編集部`

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

  const related = getRelatedArticles(article)
  const collections = getCollectionsForArticle(article)
  const faqs = getFaqs(article)
  const updatedAt = getUpdatedAt(article)
  const author = article.author ?? DEFAULT_AUTHOR
  const articleUrl = absoluteUrl(`/articles/${article.id}/`)
  const description = getArticleDescription(article)

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
    dateModified: updatedAt,
    url: articleUrl,
    inLanguage: "ja-JP",
    author: article.author
      ? { "@type": "Person", name: article.author, url: absoluteUrl("/about/") }
      : ORGANIZATION,
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  return (
    <article style={{ maxWidth: "920px", margin: "0 auto" }}>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={claimReviewJsonLd} />
      <JsonLd data={faqJsonLd} />
      <Breadcrumb
        items={[
          { name: article.category, path: categoryPath(article.category) },
          { name: article.title, path: `/articles/${article.id}/` },
        ]}
      />

      {/* Header */}
      <header style={{ marginBottom: "2rem" }}>
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
            marginBottom: "0.5rem",
          }}
        >
          <Link
            href={categoryPath(article.category)}
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
          <TagList tags={article.tags} />
        </div>
        <p style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
          公開日 <time dateTime={article.created_at}>{article.created_at}</time>
          {updatedAt !== article.created_at && (
            <>
              {" "}
              / 最終更新日 <time dateTime={updatedAt}>{updatedAt}</time>
            </>
          )}{" "}
          / 執筆 <Link href="/about/">{author}</Link>
        </p>
      </header>

      <Section label="結論">
        <p style={{ fontWeight: 600 }}>{getConclusion(article)}</p>
      </Section>

      <Section label="判定">
        <VerdictBadge verdict={article.verdict} />
        <p style={{ marginTop: "0.25rem" }}>
          {VERDICT_INFO[article.verdict].description}{" "}
          <Link href={verdictPath(article.verdict)}>
            「{article.verdict_label}」と判定した記事の一覧
          </Link>
        </p>
      </Section>

      <Section label="よくある説（俗説）">
        <p style={{ fontWeight: 600 }}>{article.claim}</p>
        <p style={{ marginTop: "0.5rem", color: "var(--muted)" }}>
          {article.common_belief}
        </p>
      </Section>

      <Section label="検証">
        <p>{article.explanation}</p>
      </Section>

      <Section label="実際の有力説">
        <p>{article.truth}</p>
      </Section>

      <Section label="なぜ広まったか">
        <p>{article.why_spread}</p>
      </Section>

      <Section label="見分け方">
        <p>{article.how_to_identify}</p>
      </Section>

      <Section label="よくある質問">
        <dl
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {faqs.map((faq) => (
            <div key={faq.question}>
              <dt style={{ fontWeight: 700 }}>Q. {faq.question}</dt>
              <dd>A. {faq.answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

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

      <Section label="この記事について">
        <p style={{ fontSize: "0.875rem" }}>
          執筆: {author} / 検証日: {article.created_at} / 最終更新日:{" "}
          {updatedAt}
          <br />
          上記の出典をもとに検証しています。検証方針と運営者は
          <Link href="/about/">このサイトについて</Link>をご覧ください。
        </p>
      </Section>

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

      {collections.length > 0 && (
        <section style={{ marginTop: "2rem" }}>
          <h2 className="section-title">関連するまとめ</h2>
          <ul style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem" }}>
            {collections.map((c) => (
              <li key={c.slug}>
                <Link href={collectionPath(c.slug)}>{c.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

export default ArticleDetailPage
