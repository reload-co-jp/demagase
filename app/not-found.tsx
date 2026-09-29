import { FC } from "react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false, follow: true },
}

const NotFound: FC = () => (
  <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
    <h1
      style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem" }}
    >
      ページが見つかりません
    </h1>
    <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
      URLが変更されたか、削除された可能性があります。
    </p>
    <Link href="/articles/" className="btn">
      記事一覧から探す
    </Link>
  </div>
)

export default NotFound
