import { FC } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Verdict } from "types/article"
import { getArticlesByVerdict, getRelatedTags } from "lib/articles"
import { VERDICT_INFO, VERDICTS } from "lib/taxonomy"
import { listPageMetadata, verdictPath } from "lib/seo"
import { ListingPage } from "components/features/listing-page"

type Props = {
  params: Promise<{ status: string }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  return VERDICTS.map((status) => ({ status }))
}

function getInfo(status: string) {
  return VERDICTS.includes(status as Verdict)
    ? VERDICT_INFO[status as Verdict]
    : undefined
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { status } = await params
  const info = getInfo(status)
  if (!info) return {}
  return listPageMetadata({
    title: `判定「${info.label}」の検証記事`,
    description: `DemaGaseの判定「${info.label}」とは：${info.description}`,
    path: verdictPath(status),
    noindex: getArticlesByVerdict(status as Verdict).length === 0,
  })
}

const VerificationPage: FC<Props> = async ({ params }) => {
  const { status } = await params
  const info = getInfo(status)
  if (!info) notFound()

  const articles = getArticlesByVerdict(status as Verdict)

  return (
    <ListingPage
      title={`判定「${info.label}」の検証記事`}
      path={verdictPath(status)}
      description={`「${info.label}」とは：${info.description}`}
      articles={articles}
      relatedTags={getRelatedTags(articles).slice(0, 15)}
      relatedLinks={[
        {
          heading: "ほかの判定",
          items: VERDICTS.filter((v) => v !== status).map((v) => ({
            name: VERDICT_INFO[v].label,
            path: verdictPath(v),
          })),
        },
      ]}
    />
  )
}

export default VerificationPage
