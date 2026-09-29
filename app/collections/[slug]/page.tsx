import { FC } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getArticlesByCollection, getRelatedTags } from "lib/articles"
import { COLLECTIONS, MIN_INDEXABLE_ARTICLES } from "lib/taxonomy"
import { categoryPath, collectionPath, listPageMetadata } from "lib/seo"
import { ListingPage } from "components/features/listing-page"

type Props = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }))
}

function findCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = findCollection((await params).slug)
  if (!collection) return {}
  return listPageMetadata({
    title: collection.title,
    description: collection.description,
    path: collectionPath(collection.slug),
    noindex:
      getArticlesByCollection(collection).length < MIN_INDEXABLE_ARTICLES,
  })
}

const CollectionPage: FC<Props> = async ({ params }) => {
  const collection = findCollection((await params).slug)
  if (!collection) notFound()

  const articles = getArticlesByCollection(collection)

  return (
    <ListingPage
      title={collection.title}
      path={collectionPath(collection.slug)}
      description={collection.description}
      articles={articles}
      relatedTags={getRelatedTags(articles, collection.tags).slice(0, 15)}
      relatedLinks={[
        {
          heading: "関連カテゴリ",
          items: collection.categories.map((c) => ({
            name: c,
            path: categoryPath(c),
          })),
        },
        {
          heading: "ほかのまとめ",
          items: COLLECTIONS.filter((c) => c !== collection).map((c) => ({
            name: c.title,
            path: collectionPath(c.slug),
          })),
        },
      ]}
    />
  )
}

export default CollectionPage
