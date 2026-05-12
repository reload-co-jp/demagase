import { FC } from "react"
import { Verdict } from "types/article"

type Config = { label: string; color: string }

const VERDICT: Record<Verdict, Config> = {
  false: { label: "誤り", color: "#e44b4b" },
  partial: { label: "一部誤り", color: "#f0a000" },
  unconfirmed: { label: "有力説だが確定ではない", color: "#c58a2b" },
  true: { label: "正しい", color: "#19a565" },
  unknown: { label: "不明", color: "#778391" },
}

type Props = {
  verdict: Verdict
  size?: "sm" | "md" | "lg"
}

export const VerdictBadge: FC<Props> = ({ verdict, size = "md" }) => {
  const c = VERDICT[verdict]
  const styles: Record<string, React.CSSProperties> = {
    sm: { padding: "0.16rem 0.42rem", fontSize: "0.6875rem" },
    md: { padding: "0.22rem 0.55rem", fontSize: "0.75rem" },
    lg: { padding: "0.38rem 0.8rem", fontSize: "0.9375rem" },
  }
  return (
    <span
      style={{
        color: c.color,
        backgroundColor: "transparent",
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        letterSpacing: 0,
        ...styles[size],
      }}
    >
      <span>{c.label}</span>
    </span>
  )
}
