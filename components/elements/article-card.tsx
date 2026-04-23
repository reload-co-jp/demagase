import { FC } from "react"
import Link from "next/link"
import { Article } from "types/article"
import { VerdictBadge } from "components/elements/verdict-badge"

type Props = {
  article: Article
}

export const ArticleCard: FC<Props> = ({ article }) => (
  <Link href={`/articles/${article.id}/`} className="card" style={{ display: "block", textDecoration: "none" }}>
    <div style={{ marginBottom: "0.5rem" }}>
      <VerdictBadge verdict={article.verdict} size="sm" />
    </div>
    <h3
      style={{
        fontSize: "1rem",
        fontWeight: 700,
        color: "var(--text)",
        marginBottom: "0.5rem",
        lineHeight: 1.5,
      }}
    >
      {article.title}
    </h3>
    <p
      style={{
        fontSize: "0.8125rem",
        color: "var(--muted)",
        marginBottom: "0.75rem",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {article.claim}
    </p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", alignItems: "center" }}>
      <span
        style={{
          fontSize: "0.75rem",
          color: "var(--accent-secondary)",
          background: "#eef1ff",
          padding: "0.18rem 0.55rem",
          borderRadius: "100px",
          fontWeight: 700,
        }}
      >
        {article.category}
      </span>
      {article.tags.slice(0, 2).map((tag) => (
        <span key={tag} className="tag">
          {tag}
        </span>
      ))}
    </div>
  </Link>
)
