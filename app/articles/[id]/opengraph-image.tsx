import { ImageResponse } from "next/og"
import { getAllArticles, getArticleById } from "lib/articles"
import { Verdict } from "types/article"

export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

type Props = { params: Promise<{ id: string }> }

const verdictColor: Record<Verdict, string> = {
  false: "#e44b4b",
  partial: "#f0a000",
  unconfirmed: "#c58a2b",
  true: "#19a565",
  unknown: "#778391",
}

const verdictLabelMap: Record<Verdict, string> = {
  false: "誤り",
  partial: "一部誤り",
  unconfirmed: "有力説だが確定ではない",
  true: "正しい",
  unknown: "不明",
}

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ id: a.id }))
}

export default async function ArticleOGImage({ params }: Props) {
  const { id } = await params
  const article = getArticleById(id)

  if (!article) {
    return new ImageResponse(<div>Not found</div>, size)
  }

  const color = verdictColor[article.verdict]
  const label = verdictLabelMap[article.verdict]
  const fontSize = article.title.length > 28 ? "52px" : "64px"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #fff9f2 0%, #ffe2cf 55%, #ffd1dd 100%)",
          padding: "56px",
          color: "#2f2452",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#2f2452",
              color: "#ffd166",
              fontSize: "32px",
              fontWeight: 800,
            }}
          >
            D
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800 }}>DemaGase</div>
          <div
            style={{
              marginLeft: "auto",
              padding: "8px 24px",
              borderRadius: "999px",
              background: color,
              color: "#fff",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            {label}
          </div>
        </div>

        <div
          style={{
            fontSize,
            fontWeight: 800,
            lineHeight: 1.3,
            flex: 1,
            display: "flex",
            alignItems: "center",
            paddingTop: "32px",
            paddingBottom: "32px",
          }}
        >
          {article.title}
        </div>

        <div style={{ display: "flex", gap: "16px", fontSize: "22px", color: "#5f537f" }}>
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.72)",
            }}
          >
            {article.category}
          </div>
          {article.tags.slice(0, 3).map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.72)",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
