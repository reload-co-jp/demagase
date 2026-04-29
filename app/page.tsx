import { FC } from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { getAllArticles, getAllCategories } from "lib/articles"
import { ArticleCard } from "components/elements/article-card"
import { TodayArticle } from "components/features/today-article"

export const metadata: Metadata = {
  title: "DemaGase｜雑学デマ検証サイト",
  description: "雑学・トリビア・語源の俗説を出典付きで検証。誤用や思い込みを短く読める記事で整理する。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DemaGase｜雑学デマ検証サイト",
    description: "雑学・トリビア・語源の俗説を出典付きで検証。誤用や思い込みを短く読める記事で整理する。",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "DemaGase｜雑学デマ検証サイト",
    description: "雑学・トリビア・語源の俗説を出典付きで検証。誤用や思い込みを短く読める記事で整理する。",
  },
}

const VERDICTS = [
  { icon: "❌", label: "誤り", desc: "根拠がなく、誤りと断定できる" },
  { icon: "⚠️", label: "一部誤り", desc: "部分的に正しいが、全体として誤解を招く" },
  { icon: "🤔", label: "有力説だが確定ではない", desc: "有力な説だが、確定的な証拠がない" },
  { icon: "⭕", label: "正しい", desc: "根拠に基づいて正しいと言える" },
  { icon: "❓", label: "不明", desc: "情報が不足しており判断できない" },
]

const Page: FC = () => {
  const articles = getAllArticles()
  const categories = getAllCategories()
  const newArticles = articles.slice(0, 6)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
      <section>
        <div
          style={{
            marginBottom: "0.75rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.45rem 0.8rem",
            borderRadius: "999px",
            background: "var(--accent-soft)",
            border: "1px solid var(--border)",
          }}
        >
          <span style={{ fontSize: "0.95rem" }}>✨</span>
          <p style={{ fontSize: "0.78rem", color: "var(--text)", fontWeight: 700 }}>
            今日の雑学デマ
          </p>
        </div>
        <p style={{ color: "var(--muted)", marginBottom: "1rem", fontSize: "0.95rem" }}>
          ひとつ読むだけで、誰かに話したくなる検証ネタ。
        </p>
        <TodayArticle articles={articles} />
      </section>

      <section>
        <h2 className="section-title">新着記事</h2>
        <div className="grid-3">
          {newArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link href="/articles/" className="btn">
            すべての記事を見る
          </Link>
        </div>
      </section>

      <section>
        <h2 className="section-title">カテゴリ</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/articles/?category=${encodeURIComponent(cat)}`}
              className="btn"
              style={{ fontSize: "0.9375rem" }}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">判定ラベルについて</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {VERDICTS.map((v) => (
            <div
              key={v.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem 1rem",
                background: "rgba(255,255,255,0.72)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>{v.icon}</span>
              <div>
                <span style={{ fontWeight: 600, marginRight: "0.5rem" }}>{v.label}</span>
                <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>{v.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Page
