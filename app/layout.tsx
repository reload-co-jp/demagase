import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import "./reset.css"
import "./globals.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://demagase.reload.co.jp"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "DemaGase",
  title: {
    default: "DemaGase｜雑学デマ検証サイト",
    template: "%s | DemaGase",
  },
  description: "広く知られている雑学・トリビアの中に含まれる誤情報を出典に基づいて検証するサイト。",
  keywords: ["雑学", "トリビア", "デマ", "ファクトチェック", "語源", "俗説", "誤用", "検証"],
  alternates: { canonical: "/" },
  referrer: "origin-when-cross-origin",
  creator: "DemaGase",
  publisher: "DemaGase",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "DemaGase",
    title: "DemaGase｜雑学デマ検証サイト",
    description: "広く知られている雑学・トリビアの中に含まれる誤情報を出典に基づいて検証するサイト。",
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "DemaGase" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DemaGase｜雑学デマ検証サイト",
    description: "広く知られている雑学・トリビアの中に含まれる誤情報を出典に基づいて検証するサイト。",
    images: ["/twitter-image"],
  },
}

const GA_MEASUREMENT_ID = "G-8PTS0V0KJM"
const isProduction = process.env.NODE_ENV === "production"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DemaGase",
    alternateName: "デマガセ",
    url: siteUrl,
    description: "広く知られている雑学・トリビアの中に含まれる誤情報を出典に基づいて検証するサイト。",
    inLanguage: "ja-JP",
    publisher: {
      "@type": "Organization",
      name: "DemaGase",
      url: siteUrl,
    },
  }

  return (
    <html lang="ja">
      <body>
        <Script id="website-json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        {isProduction && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        <header
          style={{
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            padding: "0 1.25rem",
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "3.5rem",
              padding: "0",
            }}
          >
            <Link
              href="/"
              style={{
                fontSize: "1.125rem",
                fontWeight: 800,
                color: "var(--text)",
                textDecoration: "none",
              }}
            >
              DemaGase
              <span style={{ fontSize: "0.6875rem", color: "var(--muted)", marginLeft: "0.375rem", fontWeight: 400 }}>
                雑学デマ検証
              </span>
            </Link>
            <nav style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem" }}>
              <Link href="/articles/" style={{ color: "var(--muted)" }}>
                記事一覧
              </Link>
              <Link href="/about/" style={{ color: "var(--muted)" }}>
                このサイトについて
              </Link>
            </nav>
          </div>
        </header>
        <main className="container" style={{ padding: "2rem 1.25rem", minHeight: "calc(100dvh - 3.5rem - 3.5rem)" }}>
          {children}
        </main>
        <footer
          style={{
            backgroundColor: "var(--surface)",
            borderTop: "1px solid var(--border)",
            height: "3.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="container" style={{ padding: "0" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              &copy; 2026 DemaGase - 情報は正確を期していますが、専門家への相談を推奨します。
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

export default RootLayout
