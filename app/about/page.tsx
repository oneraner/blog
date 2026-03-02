import { Suspense } from 'react'
import { MDXRemote } from 'next-mdx-remote-client/rsc'
import type { MDXRemoteOptions } from 'next-mdx-remote-client/rsc'
import remarkGfm from 'remark-gfm'
import { getAllAuthors } from '@/lib/content'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from '@/lib/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { components } from '@/components/MDXComponents'

export const metadata = genPageMetadata({ title: 'About' })

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="text-red-500">
      <p>Error rendering MDX:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

export default async function Page() {
  const allAuthors = getAllAuthors()
  const author = allAuthors.find((p) => p.slug === 'default')

  if (!author) {
    return <div>Author not found</div>
  }

  const mainContent = coreContent(author)

  const options: MDXRemoteOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  }

  return (
    <AuthorLayout content={mainContent}>
      <Suspense fallback={<div>Loading...</div>}>
        <MDXRemote
          source={author.body.raw}
          components={components}
          options={options}
          onError={ErrorComponent}
        />
      </Suspense>
    </AuthorLayout>
  )
}
