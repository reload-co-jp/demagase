import { FC } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { VerdictBadge } from "components/elements/verdict-badge"
import { Verdict } from "types/article"

export const metadata: Metadata = {
  title: "このサイトについて",
  description: "DemaGase の運営方針、判定ラベル、記事の読み方をまとめたページ。",
  alternates: { canonical: "/about/" },
  openGraph: {
    title: "このサイトについて | DemaGase",
    description: "DemaGase の運営方針、判定ラベル、記事の読み方をまとめたページ。",
    url: "/about/",
  },
}

const verdicts: { verdict: Verdict; desc: string }[] = [
  { verdict: "false", desc: "根拠がなく、誤りと断定できる俗説・誤情報" },
  { verdict: "partial", desc: "部分的に正しいが、全体として誤解を招く情報" },
  { verdict: "unconfirmed", desc: "有力な説だが、確定的な証拠が存在しない" },
  { verdict: "true", desc: "信頼できる根拠に基づいて正しいと言える情報" },
  { verdict: "unknown", desc: "情報が不足しており、現時点では判断できない" },
]

const companyInfo = [
  { label: "会社名", value: "株式会社リロード / Reload, Inc." },
  { label: "代表者", value: "山本翔平" },
  { label: "設立", value: "2014年8月22日" },
  { label: "事業内容", value: "インターネット関連事業" },
  { label: "所在地", value: "〒101-0046 東京都千代田区神田佐久間町3-37-1 山茂登ビル 3F" },
]

const AboutPage: FC = () => (
  <div style={{ maxWidth: "720px", margin: "0 auto" }}>
    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>このサイトについて</h1>

    <section style={{ marginBottom: "2.5rem" }}>
      <h2 className="section-title">DemaGase とは</h2>
      <p style={{ lineHeight: 1.9 }}>
        DemaGase（デマガセ）は、広く知られている雑学・トリビアの中に含まれる誤情報や誤解を、出典に基づいて検証するサイトです。
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

    <section style={{ marginBottom: "2.5rem" }}>
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

    <section>
      <h2 className="section-title">運営会社</h2>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "1rem",
        }}
      >
        <dl style={{ display: "grid", gridTemplateColumns: "120px 1fr", rowGap: "0.75rem", columnGap: "1rem", margin: 0 }}>
          {companyInfo.map((item) => (
            <div key={item.label} style={{ display: "contents" }}>
              <dt style={{ color: "var(--muted)", fontSize: "0.875rem" }}>{item.label}</dt>
              <dd style={{ margin: 0, color: "var(--text)", fontSize: "0.9375rem", lineHeight: 1.7 }}>{item.value}</dd>
            </div>
          ))}
          <div style={{ display: "contents" }}>
            <dt style={{ color: "var(--muted)", fontSize: "0.875rem" }}>公式サイト</dt>
            <dd style={{ margin: 0, fontSize: "0.9375rem" }}>
              <Link href="https://reload.co.jp/" target="_blank" rel="noopener noreferrer">
                https://reload.co.jp/
              </Link>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  </div>
)

export default AboutPage
