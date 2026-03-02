// Type definitions to replace contentlayer/generated

import type { AnalyticsConfig } from './analytics-types'

export interface TocItem {
    value: string
    url: string
    depth: number
}

export interface ReadingTime {
    text: string
    minutes: number
    time: number
    words: number
}

export interface Blog {
    title: string
    date: string
    tags: string[]
    lastmod?: string
    draft?: boolean
    summary?: string
    images?: string | string[]
    authors?: string[]
    layout?: string
    bibliography?: string
    canonicalUrl?: string
    slug: string
    path: string
    filePath: string
    readingTime: ReadingTime
    toc: TocItem[]
    body: {
        raw: string
        code?: string
    }
    structuredData: {
        '@context': string
        '@type': string
        headline: string
        datePublished: string
        dateModified: string
        description?: string
        image?: string
        url: string
    }
}

export interface Authors {
    name: string
    avatar?: string
    occupation?: string
    company?: string
    email?: string
    twitter?: string
    bluesky?: string
    linkedin?: string
    github?: string
    layout?: string
    slug: string
    path: string
    filePath: string
    body: {
        raw: string
        code?: string
    }
}

export interface SiteMetadata {
    title: string
    author: string
    headerTitle: string
    description: string
    language: string
    theme: 'system' | 'dark' | 'light'
    siteUrl: string
    siteRepo: string
    siteLogo: string
    socialBanner: string
    email: string
    github: string
    linkedin: string
    locale: string
    stickyNav: boolean
    analytics: AnalyticsConfig
    newsletter: {
        provider: string
    }
    comments: {
        provider: string
        giscusConfig: {
            repo: string
            repositoryId: string
            category: string
            categoryId: string
            mapping: string
            reactions: string
            metadata: string
            theme: string
            darkTheme: string
            themeURL: string
            lang: string
        }
    }
    search: {
        provider: string
        kbarConfig: {
            searchDocumentsPath: string
        }
    }
}
