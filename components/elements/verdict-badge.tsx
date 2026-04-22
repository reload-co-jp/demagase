import { FC } from "react"
import { Verdict } from "types/article"

type Config = { icon: string; label: string; color: string; bg: string }

const VERDICT: Record<Verdict, Config> = {
  false: { icon: "❌", label: "誤り", color: "#fff", bg: "#b91c1c" },
  partial: { icon: "⚠️", label: "一部誤り", color: "#000", bg: "#e8a400" },
  unconfirmed: { icon: "🤔", label: "有力説だが確定ではない", color: "#000", bg: "#d29922" },
  true: { icon: "⭕", label: "正しい", color: "#fff", bg: "#16a34a" },
  unknown: { icon: "❓", label: "不明", color: "#fff", bg: "#6e7681" },
}

type Props = {
  verdict: Verdict
  size?: "sm" | "md" | "lg"
}

export const VerdictBadge: FC<Props> = ({ verdict, size = "md" }) => {
  const c = VERDICT[verdict]
  const styles: Record<string, React.CSSProperties> = {
    sm: { padding: "0.2rem 0.5rem", fontSize: "0.75rem" },
    md: { padding: "0.3rem 0.75rem", fontSize: "0.875rem" },
    lg: { padding: "0.6rem 1.25rem", fontSize: "1.125rem" },
  }
  return (
    <span
      style={{
        backgroundColor: c.bg,
        color: c.color,
        borderRadius: "6px",
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        ...styles[size],
      }}
    >
      {c.icon} {c.label}
    </span>
  )
}
