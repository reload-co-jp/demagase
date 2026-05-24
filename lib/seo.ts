export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://demagase.reload.co.jp"

export const SITE_NAME = "DemaGase"

export const SITE_DESCRIPTION =
  "雑学・トリビア・語源の俗説を出典付きで検証。誤用や思い込みを短く読める記事で整理する。"

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
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
