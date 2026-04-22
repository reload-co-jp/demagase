"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Article } from "types/article"
import { VerdictBadge } from "components/elements/verdict-badge"

type Props = {
  articles: Article[]
}

export const TodayArticle = ({ articles }: Props) => {
  const article = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return articles[dayOfYear % articles.length]
  }, [articles])

  if (!article) return null

  return (
    <Link
      href={`/articles/${article.id}/`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "1.75rem",
          transition: "border-color 0.15s",
        }}
        className="card"
      >
        <div style={{ marginBottom: "0.75rem" }}>
          <VerdictBadge verdict={article.verdict} size="lg" />
        </div>
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: "0.75rem",
            lineHeight: 1.4,
          }}
        >
          {article.title}
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>{article.claim}</p>
        <p style={{ fontSize: "0.875rem", color: "var(--accent)" }}>詳しく読む →</p>
      </div>
    </Link>
  )
}
