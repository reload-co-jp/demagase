"use client"

import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Article } from "types/article"
import { ArticleCard } from "components/elements/article-card"
import { Verdict } from "types/article"

type Props = {
  articles: Article[]
  categories: string[]
}

const queryKeys = ["q", "category", "tag", "verdict"] as const

const isVerdict = (value: string): value is Verdict => {
  return ["true", "false", "partial", "unconfirmed", "unknown"].includes(value)
}

export const ArticleListClient = ({ articles, categories }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const activeCategory = searchParams.get("category") ?? ""
  const activeTag = searchParams.get("tag") ?? ""
  const activeVerdict = searchParams.get("verdict") ?? ""

  const updateQuery = (updates: Partial<Record<(typeof queryKeys)[number], string>>) => {
    const params = new URLSearchParams(searchParams.toString())

    queryKeys.forEach((key) => {
      const value = updates[key]
      if (value === undefined) return
      if (value.trim() === "") {
        params.delete(key)
        return
      }
      params.set(key, value)
    })

    const next = params.toString()
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
  }

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCategory = activeCategory === "" || a.category === activeCategory
      const matchTag = activeTag === "" || a.tags.includes(activeTag)
      const matchVerdict = activeVerdict === "" || (isVerdict(activeVerdict) && a.verdict === activeVerdict)
      const q = query.toLowerCase()
      const matchQuery =
        q === "" ||
        a.title.toLowerCase().includes(q) ||
        a.claim.toLowerCase().includes(q) ||
        a.common_belief.toLowerCase().includes(q) ||
        a.truth.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      return matchCategory && matchTag && matchVerdict && matchQuery
    })
  }, [articles, query, activeCategory, activeTag, activeVerdict])

  const hasActiveFilter = query !== "" || activeCategory !== "" || activeTag !== "" || activeVerdict !== ""

  return (
    <div>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          padding: "0.9rem",
        }}
      >
        <input
          className="input"
          type="search"
          placeholder="タイトル・テーマで検索..."
          key={query}
          defaultValue={query}
          onChange={(e) => {
            const value = e.target.value
            updateQuery({ q: value })
          }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <button
            className={`btn${activeCategory === "" ? " btn-active" : ""}`}
            onClick={() => updateQuery({ category: "" })}
          >
            すべて
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn${activeCategory === cat ? " btn-active" : ""}`}
              onClick={() => updateQuery({ category: cat })}
            >
              {cat}
            </button>
          ))}
        </div>
        {hasActiveFilter && (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>絞り込み中</span>
            {activeTag && <span className="tag">タグ: {activeTag}</span>}
            {activeVerdict && <span className="tag">判定: {activeVerdict}</span>}
            <button className="btn" onClick={() => updateQuery({ q: "", category: "", tag: "", verdict: "" })}>
              解除
            </button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--muted)", textAlign: "center", padding: "3rem 0" }}>
          該当する記事が見つかりませんでした。
        </p>
      ) : (
        <>
          <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
            {filtered.length}件の記事
          </p>
          <div className="dense-list">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
