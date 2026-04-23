import { FC } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Script from "next/script"
import { getAllArticles, getArticleById } from "lib/articles"
import { VerdictBadge } from "components/elements/verdict-badge"
import { ArticleCard } from "components/elements/article-card"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://demagase.reload.co.jp"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((a) => ({ id: a.id }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const article = getArticleById(id)
  if (!article) return {}
  const description = article.explanation.slice(0, 120)
  return {
    title: article.title,
    description,
    alternates: { canonical: `/articles/${id}/` },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url: `/articles/${id}/`,
      publishedTime: article.created_at,
      tags: article.tags,
    },
    twitter: {
      card: "summary",
      title: article.title,
      description,
    },
  }
}

const Section: FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
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
  const related = allArticles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.explanation.slice(0, 120),
    datePublished: article.created_at,
    url: `${siteUrl}/articles/${article.id}/`,
    publisher: { "@type": "Organization", name: "DemaGase", url: siteUrl },
    keywords: article.tags.join(", "),
  }

  return (
    <article style={{ maxWidth: "760px", margin: "0 auto" }}>
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Breadcrumb */}
      <nav style={{ fontSize: "0.8125rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
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
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, lineHeight: 1.35, marginBottom: "1rem" }}>
          {article.title}
        </h1>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span
            style={{
              fontSize: "0.8125rem",
              color: "var(--accent)",
              background: "rgba(88,166,255,0.1)",
              padding: "0.2rem 0.625rem",
              borderRadius: "100px",
            }}
          >
            {article.category}
          </span>
          {article.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
          <span style={{ fontSize: "0.8125rem", color: "var(--muted)", marginLeft: "auto" }}>
            {article.created_at}
          </span>
        </div>
      </header>

      {/* Claim */}
      <Section label="よくある説（俗説）">
        <p style={{ fontWeight: 600 }}>{article.claim}</p>
        <p style={{ marginTop: "0.5rem", color: "var(--muted)" }}>{article.common_belief}</p>
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
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {article.sources.map((s, i) => (
              <li key={i} style={{ fontSize: "0.875rem" }}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.title}
                  </a>
                ) : (
                  <span>{s.title}</span>
                )}
                {s.author && <span style={{ color: "var(--muted)", marginLeft: "0.5rem" }}>— {s.author}</span>}
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
