export type Verdict = "true" | "false" | "partial" | "unconfirmed" | "unknown"

export type Source = {
  title: string
  url?: string
  author?: string
}

export type Article = {
  id: string
  title: string
  category: string
  claim: string
  verdict: Verdict
  verdict_label: string
  common_belief: string
  explanation: string
  truth: string
  why_spread: string
  how_to_identify: string
  sources: Source[]
  tags: string[]
  created_at: string
}
