import { FC } from "react"
import { VerdictBadge } from "components/elements/verdict-badge"
import { Verdict } from "types/article"

export const metadata = {
  title: "このサイトについて | GaseDema",
}

const verdicts: { verdict: Verdict; desc: string }[] = [
  { verdict: "false", desc: "根拠がなく、誤りと断定できる俗説・誤情報" },
  { verdict: "partial", desc: "部分的に正しいが、全体として誤解を招く情報" },
  { verdict: "unconfirmed", desc: "有力な説だが、確定的な証拠が存在しない" },
  { verdict: "true", desc: "信頼できる根拠に基づいて正しいと言える情報" },
  { verdict: "unknown", desc: "情報が不足しており、現時点では判断できない" },
]

const AboutPage: FC = () => (
  <div style={{ maxWidth: "720px", margin: "0 auto" }}>
    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>このサイトについて</h1>

    <section style={{ marginBottom: "2.5rem" }}>
      <h2 className="section-title">GaseDema とは</h2>
      <p style={{ lineHeight: 1.9 }}>
        GaseDema（ガセデマ）は、広く知られている雑学・トリビアの中に含まれる誤情報や誤解を、出典に基づいて検証するサイトです。
      </p>
      <p style={{ lineHeight: 1.9, marginTop: "0.75rem" }}>
        「なんとなく知ってる」を疑い、軽く読めるが根拠は重い、そんなコンテンツを目指しています。
        誰かを否定するのではなく、「情報を検証する」ことが目的です。
      </p>
    </section>

    <section style={{ marginBottom: "2.5rem" }}>
      <h2 className="section-title">判定ラベルの説明</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {verdicts.map(({ verdict, desc }) => (
          <div
            key={verdict}
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <div style={{ flexShrink: 0, paddingTop: "0.125rem" }}>
              <VerdictBadge verdict={verdict} size="sm" />
            </div>
            <p style={{ fontSize: "0.9375rem", color: "var(--muted)" }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section style={{ marginBottom: "2.5rem" }}>
      <h2 className="section-title">記事の構成</h2>
      <ol
        style={{
          paddingLeft: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          color: "var(--text)",
        }}
      >
        <li>よくある説（俗説） — 広まっている説の内容</li>
        <li>検証 — 語源・文献・研究の有無などの根拠を確認</li>
        <li>実際の有力説 — 信頼できる根拠に基づく説明</li>
        <li>なぜ広まったか — 拡散の背景・心理的要因</li>
        <li>見分け方 — 同様の誤解を避けるための視点</li>
        <li>出典 — 辞書・論文・専門書など</li>
      </ol>
    </section>

    <section>
      <h2 className="section-title">運営方針</h2>
      <ul
        style={{
          paddingLeft: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          color: "var(--muted)",
          fontSize: "0.9375rem",
        }}
      >
        <li>個人や団体を攻撃せず、情報そのものを検証する</li>
        <li>「未確定」「不明」を許容し、断定しすぎない</li>
        <li>出典を明記し、読者が自分で確認できる状態にする</li>
        <li>読者の判断力向上を目的とする</li>
      </ul>
    </section>
  </div>
)

export default AboutPage
