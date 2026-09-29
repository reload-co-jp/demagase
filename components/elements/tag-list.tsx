import { FC } from "react"
import Link from "next/link"
import { tagPath } from "lib/seo"

export const TagList: FC<{ tags: string[] }> = ({ tags }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
    {tags.map((tag) => (
      <Link
        key={tag}
        href={tagPath(tag)}
        className="tag"
        style={{ textDecoration: "none" }}
      >
        {tag}
      </Link>
    ))}
  </div>
)
