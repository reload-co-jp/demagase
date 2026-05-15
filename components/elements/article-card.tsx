import { FC } from "react"
import Link from "next/link"
import { Article } from "types/article"
import { Verdict } from "types/article"
import { getCategoryTheme } from "lib/category-theme"

type Props = {
  article: Article
}

const verdictBorderColor: Record<Verdict, string> = {
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

export const ArticleCard: FC<Props> = ({ article }) => {
  const theme = getCategoryTheme(article.category)

  return (
    <Link
      href={`/articles/${article.id}/`}
      className="card"
      style={{
        display: "block",
        textDecoration: "none",
        borderRadius: 0,
        borderLeft: `3px solid ${verdictBorderColor[article.verdict]}`,
        background: "var(--surface)",
        borderColor: theme.border,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.55rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          fontSize: "0.68rem",
          fontWeight: 700,
          color: verdictBorderColor[article.verdict],
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: "0.52rem",
            height: "0.52rem",
            borderRadius: "999px",
            background: verdictBorderColor[article.verdict],
          }}
        />
        <span>{verdictLabel[article.verdict]}</span>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center", marginBottom: "0.35rem" }}>
          <span style={{ fontSize: "0.72rem", color: theme.chipText, fontWeight: 600 }}>{article.category}</span>
        </div>
        <h3
          style={{
            fontSize: "0.98rem",
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: "0.35rem",
            lineHeight: 1.5,
          }}
        >
          {article.title}
        </h3>
        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--muted)",
            marginBottom: "0.55rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.claim}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "0.75rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            {article.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <time dateTime={article.created_at} style={{ fontSize: "0.66rem", color: "var(--muted)", whiteSpace: "nowrap" }}>{article.created_at}</time>
        </div>
      </div>
    </Link>
  )
}
