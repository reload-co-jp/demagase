import { FC } from "react"
import Link from "next/link"
import { Article } from "types/article"
import { absoluteUrl, ORGANIZATION, SITE_NAME, SITE_URL } from "lib/seo"
import { ArticleCard } from "components/elements/article-card"
import { Breadcrumb } from "components/elements/breadcrumb"
import { JsonLd } from "components/elements/json-ld"
import { TagList } from "components/elements/tag-list"

type LinkItem = { name: string; path: string }

type Props = {
  title: string
  path: string
  description: string
  /** パンくずの中間階層 */
  parents?: LinkItem[]
  intents?: string[]
  articles: Article[]
  relatedTags?: string[]
  relatedLinks?: { heading: string; items: LinkItem[] }[]
}

const boxStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "4px",
  padding: "1rem",
  marginBottom: "1rem",
} as const

/** カテゴリ・タグ・まとめ・判定別の一覧ページ共通レイアウト */
export const ListingPage: FC<Props> = ({
  title,
  path,
  description,
  parents = [],
  intents = [],
  articles,
  relatedTags = [],
  relatedLinks = [],
}) => (
  <div>
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${title} | ${SITE_NAME}`,
        url: absoluteUrl(path),
        description,
        inLanguage: "ja-JP",
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        publisher: ORGANIZATION,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: articles.length,
          itemListElement: articles.map((a, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/articles/${a.id}/`),
            name: a.title,
          })),
        },
      }}
    />
    <Breadcrumb items={[...parents, { name: title, path }]} />
    <section style={boxStyle}>
      <h1
        style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}
      >
        {title}
      </h1>
      <p style={{ lineHeight: 1.8 }}>{description}</p>
      {intents.length > 0 && (
        <>
          <h2
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              margin: "0.75rem 0 0.35rem",
            }}
          >
            こんな疑問を検証しています
          </h2>
          <ul
            style={{
              paddingLeft: "1.25rem",
              listStyle: "disc",
              color: "var(--muted)",
            }}
          >
            {intents.map((intent) => (
              <li key={intent}>{intent}</li>
            ))}
          </ul>
        </>
      )}
      <p
        style={{
          color: "var(--muted)",
          fontSize: "0.875rem",
          marginTop: "0.75rem",
        }}
      >
        {articles.length}件の検証記事
      </p>
    </section>

    {articles.length > 0 && (
      <section style={{ marginBottom: "1.5rem" }}>
        <h2 className="section-title">記事一覧</h2>
        <div className="dense-list">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    )}

    {relatedTags.length > 0 && (
      <section style={{ marginBottom: "1.5rem" }}>
        <h2 className="section-title">関連タグ</h2>
        <TagList tags={relatedTags} />
      </section>
    )}

    {relatedLinks
      .filter(({ items }) => items.length > 0)
      .map(({ heading, items }) => (
        <section key={heading} style={{ marginBottom: "1.5rem" }}>
          <h2 className="section-title">{heading}</h2>
          <ul style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem" }}>
            {items.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
  </div>
)
