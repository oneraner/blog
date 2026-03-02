import 'css/prism.css'
import 'katex/dist/katex.css'

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote-client/rsc'
import type { MDXRemoteOptions } from 'next-mdx-remote-client/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypePrismPlus from 'rehype-prism-plus'

import { components } from '@/components/MDXComponents'
import { sortPosts, coreContent, allCoreContent } from '@/lib/utils/contentlayer'
import { getAllPosts, getAllAuthors } from '@/lib/content'
import type { Blog } from '@/lib/types'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import siteMetadata from '@/data/siteMetadata'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="text-red-500">
      <p>Error rendering MDX:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const allBlogs = getAllPosts()
  const allAuthors = getAllAuthors()
  const post = allBlogs.find((p) => p.slug === slug)
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return authorResults ? coreContent(authorResults) : null
  }).filter(Boolean)

  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author?.name).filter(Boolean)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img && img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  const allBlogs = getAllPosts()
  return allBlogs.map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const allBlogs = getAllPosts()
  const allAuthors = getAllAuthors()

  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allBlogs.find((p) => p.slug === slug) as Blog
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return authorResults ? coreContent(authorResults) : null
  }).filter(Boolean) as any[]

  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  const options: MDXRemoteOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'prepend' }],
        rehypeKatex,
        [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      ],
    },
  }

  const Layout = layouts[post.layout as keyof typeof layouts || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <Suspense fallback={<div>Loading...</div>}>
          <MDXRemote
            source={post.body.raw}
            components={components}
            options={options}
            onError={ErrorComponent}
          />
        </Suspense>
      </Layout>
    </>
  )
}
