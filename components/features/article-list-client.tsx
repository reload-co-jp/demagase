"use client"

import { useState, useMemo } from "react"
import { Article } from "types/article"
import { ArticleCard } from "components/elements/article-card"

type Props = {
  articles: Article[]
  categories: string[]
  initialCategory?: string
}

export const ArticleListClient = ({ articles, categories, initialCategory }: Props) => {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState(initialCategory ?? "")

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCategory = activeCategory === "" || a.category === activeCategory
      const q = query.toLowerCase()
      const matchQuery =
        q === "" ||
        a.title.toLowerCase().includes(q) ||
        a.claim.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      return matchCategory && matchQuery
    })
  }, [articles, query, activeCategory])

  return (
    <div>
      <div style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          className="input"
          type="search"
          placeholder="タイトル・テーマで検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <button
            className={`btn${activeCategory === "" ? " btn-active" : ""}`}
            onClick={() => setActiveCategory("")}
          >
            すべて
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn${activeCategory === cat ? " btn-active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--muted)", textAlign: "center", padding: "3rem 0" }}>
          該当する記事が見つかりませんでした。
        </p>
      ) : (
        <>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "1rem" }}>
            {filtered.length}件の記事
          </p>
          <div className="grid-3">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
