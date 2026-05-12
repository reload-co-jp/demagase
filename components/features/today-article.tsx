"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Article } from "types/article"
import { Verdict } from "types/article"
import { getCategoryTheme } from "lib/category-theme"

type Props = {
  articles: Article[]
}

const verdictMarkerColor: Record<Verdict, string> = {
  false: "#e44b4b",
  partial: "#f0a000",
  unconfirmed: "#c58a2b",
  true: "#19a565",
  unknown: "#778391",
}

const verdictLabel: Record<Verdict, string> = {
  false: "誤り",
  partial: "一部誤り",
  unconfirmed: "有力説だが確定ではない",
  true: "正しい",
  unknown: "不明",
}

export const TodayArticle = ({ articles }: Props) => {
  const article = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return articles[dayOfYear % articles.length]
  }, [articles])

  if (!article) return null

  const theme = getCategoryTheme(article.category)

  return (
    <Link
      href={`/articles/${article.id}/`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: `1px solid ${theme.border}`,
          borderRadius: "4px",
          padding: "1rem 1.1rem",
          transition: "border-color 0.15s",
          position: "relative",
        }}
        className="card"
      >
        <div
          style={{
            position: "absolute",
            top: "0.7rem",
            right: "0.7rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: verdictMarkerColor[article.verdict],
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "0.58rem",
              height: "0.58rem",
              borderRadius: "999px",
              background: verdictMarkerColor[article.verdict],
            }}
          />
          <span>{verdictLabel[article.verdict]}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.75rem", color: theme.chipText, fontWeight: 600 }}>{article.category}</span>
        </div>
        <h2
          style={{
            fontSize: "1.18rem",
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: "0.55rem",
            lineHeight: 1.4,
          }}
        >
          {article.title}
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: "0.7rem", fontSize: "0.88rem" }}>{article.claim}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "0.75rem", marginBottom: "0.7rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            {article.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <span style={{ fontSize: "0.66rem", color: "var(--muted)", whiteSpace: "nowrap" }}>{article.created_at}</span>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 700 }}>続きを読む</p>
      </div>
    </Link>
  )
}
