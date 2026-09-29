import { FC, Fragment } from "react"
import Link from "next/link"
import { absoluteUrl } from "lib/seo"
import { JsonLd } from "components/elements/json-ld"

type Item = { name: string; path: string }

/** 表示用パンくずと BreadcrumbList 構造化データ。最後の要素が現在ページ */
export const Breadcrumb: FC<{ items: Item[] }> = ({ items }) => {
  const all = [{ name: "ホーム", path: "/" }, ...items]
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
          })),
        }}
      />
      <nav
        aria-label="パンくずリスト"
        style={{
          fontSize: "0.8125rem",
          color: "var(--muted)",
          marginBottom: "1rem",
        }}
      >
        {all.map((item, index) => (
          <Fragment key={item.path}>
            {index > 0 && <span style={{ margin: "0 0.5rem" }}>/</span>}
            {index < all.length - 1 ? (
              <Link href={item.path}>{item.name}</Link>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </Fragment>
        ))}
      </nav>
    </>
  )
}
