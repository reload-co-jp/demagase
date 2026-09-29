import { FC } from "react"

/** 初期HTMLに出力されるよう next/script ではなく素の script を使う */
export const JsonLd: FC<{ data: object }> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
)
