'use client'

import { useTheme } from 'next-themes'
import Giscus from '@giscus/react'
import siteMetadata from '@/data/siteMetadata'

interface CommentsProps {
  slug: string
}

export default function Comments({ slug }: CommentsProps) {
  const { theme, resolvedTheme } = useTheme()
  const commentsTheme =
    siteMetadata.comments?.giscusConfig?.themeURL ||
    (theme === 'dark' || resolvedTheme === 'dark'
      ? siteMetadata.comments?.giscusConfig?.darkTheme || 'transparent_dark'
      : siteMetadata.comments?.giscusConfig?.theme || 'light')

  if (!siteMetadata.comments?.provider || siteMetadata.comments.provider !== 'giscus') {
    return null
  }

  const {
    repo,
    repositoryId,
    category,
    categoryId,
    mapping,
    reactions,
    metadata,
    lang,
  } = siteMetadata.comments.giscusConfig

  return (
    <Giscus
      id="comments"
      repo={repo as `${string}/${string}`}
      repoId={repositoryId}
      category={category}
      categoryId={categoryId}
      mapping={mapping as 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number'}
      reactionsEnabled={reactions}
      emitMetadata={metadata}
      inputPosition="top"
      theme={commentsTheme}
      lang={lang}
      loading="lazy"
    />
  )
}
