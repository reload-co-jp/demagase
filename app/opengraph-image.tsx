import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const alt = "DemaGase"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              width: "84px",
              height: "84px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#2f2452",
              color: "#ffd166",
              fontSize: "42px",
              fontWeight: 800,
            }}
          >
            D
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "48px", fontWeight: 800 }}>DemaGase</div>
            <div style={{ fontSize: "24px", color: "#5f537f" }}>雑学デマ検証サイト</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: "66px", fontWeight: 800, lineHeight: 1.15 }}>
            <div>よくある雑学を</div>
            <div>出典ベースで検証</div>
          </div>
          <div style={{ fontSize: "28px", color: "#5f537f", lineHeight: 1.5 }}>
            語源・歴史・誤用・俗説をわかりやすく整理
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", fontSize: "24px", color: "#5f537f" }}>
          <div style={{ padding: "10px 18px", borderRadius: "999px", background: "rgba(255,255,255,0.72)" }}>語源</div>
          <div style={{ padding: "10px 18px", borderRadius: "999px", background: "rgba(255,255,255,0.72)" }}>誤用</div>
          <div style={{ padding: "10px 18px", borderRadius: "999px", background: "rgba(255,255,255,0.72)" }}>歴史</div>
          <div style={{ padding: "10px 18px", borderRadius: "999px", background: "rgba(255,255,255,0.72)" }}>俗説検証</div>
        </div>
      </div>
    ),
    size,
  )
}
