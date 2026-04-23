import Link from "next/link"
import Script from "next/script"
import "./reset.css"
import "./globals.css"

export const metadata = {
  title: "DemaGase｜雑学デマ検証サイト",
  description: "広く知られている雑学・トリビアの中に含まれる誤情報を出典に基づいて検証するサイト。",
}

const GA_MEASUREMENT_ID = "G-8PTS0V0KJM"
const isProduction = process.env.NODE_ENV === "production"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
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
                letterSpacing: "-0.02em",
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
              &copy; 2026 DemaGase — 情報は正確を期していますが、専門家への相談を推奨します。
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

export default RootLayout
