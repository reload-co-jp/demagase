import { FC } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getAllCategories,
  getArticlesByCategory,
  getArticlesByCollection,
  getRelatedTags,
  isCategoryIndexable,
} from "lib/articles"
import { CATEGORY_INFO, COLLECTIONS } from "lib/taxonomy"
import {
  categoryPath,
  collectionPath,
  getSeoDescription,
  listPageMetadata,
} from "lib/seo"
import { ListingPage } from "components/features/listing-page"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllCategories().map((cat) => ({ slug: cat }))
}

function getDescription(category: string): string {
  return (
    CATEGORY_INFO[category]?.description ??
    `「${category}」に関する雑学・俗説を、出典をもとに検証した記事の一覧です。`
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = decodeURIComponent(slug)
  return listPageMetadata({
    title: `${category}の雑学・俗説を検証`,
    description: getSeoDescription(getDescription(category), 120),
    path: categoryPath(category),
    noindex: !isCategoryIndexable(category),
  })
}

const CategoryPage: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const category = decodeURIComponent(slug)
  const articles = getArticlesByCategory(category)

  if (articles.length === 0) notFound()

  const collections = COLLECTIONS.filter((c) =>
    getArticlesByCollection(c).some((a) => a.category === category)
  )
  const otherCategories = getAllCategories().filter(
    (c) => c !== category && isCategoryIndexable(c)
  )

  return (
    <ListingPage
      title={`${category}の雑学・俗説を検証`}
      path={categoryPath(category)}
      description={getDescription(category)}
      parents={[{ name: "記事一覧", path: "/articles/" }]}
      intents={CATEGORY_INFO[category]?.intents}
      articles={articles}
      relatedTags={getRelatedTags(articles, [category]).slice(0, 15)}
      relatedLinks={[
        {
          heading: "関連するまとめ",
          items: collections.map((c) => ({
            name: c.title,
            path: collectionPath(c.slug),
          })),
        },
        {
          heading: "ほかのカテゴリ",
          items: otherCategories.map((c) => ({
            name: c,
            path: categoryPath(c),
          })),
        },
      ]}
    />
  )
}

export default CategoryPage
