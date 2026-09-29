import type { Metadata } from "next"

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://demagase.reload.co.jp"

export const SITE_NAME = "DemaGase"

export const SITE_DESCRIPTION =
  "雑学・トリビア・語源の俗説を出典付きで検証。誤用や思い込みを短く読める記事で整理する。"

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "株式会社リロード",
  alternateName: SITE_NAME,
  url: SITE_URL,
  sameAs: ["https://reload.co.jp/"],
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString()
}

export function getSeoDescription(text: string, length = 150): string {
  const normalized = text.replace(/\s+/g, " ").trim()
  return normalized.length > length
    ? `${normalized.slice(0, length - 1)}…`
    : normalized
}

export function categoryPath(category: string): string {
  return `/articles/category/${encodeURIComponent(category)}/`
}

export function tagPath(tag: string): string {
  return `/articles/tag/${encodeURIComponent(tag)}/`
}

/** 一覧系ページ共通の title / description / canonical / OGP / robots */
export function listPageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string
  description: string
  path: string
  noindex?: boolean
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: !noindex, follow: true },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  }
}

export function collectionPath(slug: string): string {
  return `/collections/${slug}/`
}

export function verdictPath(verdict: string): string {
  return `/verification/${verdict}/`
}
