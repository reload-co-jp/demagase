import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { ORGANIZATION, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "lib/seo"
import "./reset.css"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "DemaGase｜雑学デマ検証サイト",
    template: "%s | DemaGase",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "雑学",
    "トリビア",
    "デマ",
    "ファクトチェック",
    "語源",
    "俗説",
    "誤用",
    "検証",
  ],
  alternates: { canonical: "/" },
  referrer: "origin-when-cross-origin",
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
    siteName: SITE_NAME,
    title: "DemaGase｜雑学デマ検証サイト",
    description: SITE_DESCRIPTION,
    url: "/",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "DemaGase" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DemaGase｜雑学デマ検証サイト",
    description: SITE_DESCRIPTION,
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
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ja-JP",
    publisher: ORGANIZATION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/articles/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html lang="ja">
      <body>
        <Script
          id="website-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
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
            className="container site-header-inner"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: ".5rem",
            }}
          >
            <Link
              href="/"
              className="site-header-brand"
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "var(--text)",
                textDecoration: "none",
              }}
            >
              DemaGase
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "var(--muted)",
                  marginLeft: "0.375rem",
                  fontWeight: 400,
                }}
              >
                雑学デマ検証
              </span>
            </Link>
            <nav
              className="site-header-nav"
              style={{ display: "flex", gap: ".25rem", fontSize: "0.8125rem" }}
            >
              <Link href="/articles/" style={{ color: "var(--muted)" }}>
                記事一覧
              </Link>
              <Link href="/about/" style={{ color: "var(--muted)" }}>
                このサイトについて
              </Link>
            </nav>
          </div>
        </header>
        <main
          className="container"
          style={{
            padding: "1rem 1.25rem 2rem",
            minHeight: "calc(100dvh - 7rem)",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            backgroundColor: "var(--surface)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            padding: "1rem",
            gap: "0.5rem",
          }}
        >
          <div className="container site-footer-inner" style={{ padding: "0" }}>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--muted)",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                flexWrap: "wrap",
              }}
            >
              &copy; 2026 DemaGase -
              情報は正確を期していますが、専門家への相談を推奨します。
              <Link
                href="https://reload.co.jp/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--muted)" }}
              >
                運営: 株式会社リロード
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

export default RootLayout
