import { FC } from "react"
import Link from "next/link"
import { getAllArticles, getAllCategories } from "lib/articles"
import { ArticleCard } from "components/elements/article-card"
import { TodayArticle } from "components/features/today-article"

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
      {/* Today's article */}
      <section>
        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          今日の雑学デマ
        </p>
        <TodayArticle articles={articles} />
      </section>

      {/* New articles */}
      <section>
        <h2 className="section-title">新着記事</h2>
        <div className="grid-3">
          {newArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link href="/articles/" className="btn">
            すべての記事を見る →
          </Link>
        </div>
      </section>

      {/* Categories */}
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

      {/* Verdict legend */}
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
                background: "var(--surface)",
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
