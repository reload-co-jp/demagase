import { FC } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getAllTags,
  getArticlesByTag,
  getRelatedTags,
  isTagIndexable,
} from "lib/articles"
import { TAG_DESCRIPTIONS } from "lib/taxonomy"
import { categoryPath, listPageMetadata, tagPath } from "lib/seo"
import { ListingPage } from "components/features/listing-page"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ slug: tag }))
}

// 説明文の無いタグは noindex なので汎用文で足りる
function getDescription(tag: string): string {
  return TAG_DESCRIPTIONS[tag] ?? `「${tag}」タグが付いた検証記事の一覧です。`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tag = decodeURIComponent(slug)
  return listPageMetadata({
    title: `「${tag}」の雑学・俗説を検証`,
    description: getDescription(tag),
    path: tagPath(tag),
    noindex: !isTagIndexable(tag),
  })
}

const TagPage: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const tag = decodeURIComponent(slug)
  const articles = getArticlesByTag(tag)

  if (articles.length === 0) notFound()

  const categories = [...new Set(articles.map((a) => a.category))]

  return (
    <ListingPage
      title={`「${tag}」の雑学・俗説を検証`}
      path={tagPath(tag)}
      description={getDescription(tag)}
      parents={[{ name: "記事一覧", path: "/articles/" }]}
      articles={articles}
      relatedTags={getRelatedTags(articles, [tag]).slice(0, 15)}
      relatedLinks={[
        {
          heading: "関連カテゴリ",
          items: categories.map((c) => ({ name: c, path: categoryPath(c) })),
        },
      ]}
    />
  )
}

export default TagPage
