import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { slug as slugify } from 'github-slugger'
import type { Blog, Authors, TocItem } from './types'
import siteMetadata from '@/data/siteMetadata'

const root = process.cwd()
const contentDir = path.join(root, 'data')

function extractTocHeadings(content: string): TocItem[] {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const toc: TocItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
        const depth = match[1].length
        const value = match[2].trim()
        const url = `#${slugify(value)}`
        toc.push({ value, url, depth })
    }

    return toc
}

export function getAllPosts(): Blog[] {
    const blogDir = path.join(contentDir, 'blog')
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))

    const posts = files.map((filename) => {
        const filePath = path.join('blog', filename)
        const fullPath = path.join(blogDir, filename)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        const slug = filename.replace(/\.mdx?$/, '')

        const post: Blog = {
            title: data.title,
            date: data.date instanceof Date ? data.date.toISOString() : data.date,
            tags: data.tags || [],
            lastmod: data.lastmod,
            draft: data.draft || false,
            summary: data.summary,
            images: data.images,
            authors: data.authors || ['default'],
            layout: data.layout || 'PostLayout',
            bibliography: data.bibliography,
            canonicalUrl: data.canonicalUrl,
            slug,
            path: `blog/${slug}`,
            filePath,
            readingTime: readingTime(content),
            toc: extractTocHeadings(content),
            body: {
                raw: content,
            },
            structuredData: {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: data.title,
                datePublished: data.date instanceof Date ? data.date.toISOString() : data.date,
                dateModified: data.lastmod || (data.date instanceof Date ? data.date.toISOString() : data.date),
                description: data.summary,
                image: data.images?.[0] || siteMetadata.socialBanner,
                url: `${siteMetadata.siteUrl}/blog/${slug}`,
            },
        }

        return post
    })

    return posts
}

export function getPostBySlug(slug: string): Blog | undefined {
    const posts = getAllPosts()
    return posts.find((p) => p.slug === slug)
}

export function getAllAuthors(): Authors[] {
    const authorsDir = path.join(contentDir, 'authors')
    const files = fs.readdirSync(authorsDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))

    return files.map((filename) => {
        const filePath = path.join('authors', filename)
        const fullPath = path.join(authorsDir, filename)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        const slug = filename.replace(/\.mdx?$/, '')

        return {
            name: data.name,
            avatar: data.avatar,
            occupation: data.occupation,
            company: data.company,
            email: data.email,
            twitter: data.twitter,
            bluesky: data.bluesky,
            linkedin: data.linkedin,
            github: data.github,
            layout: data.layout,
            slug,
            path: `authors/${slug}`,
            filePath,
            body: {
                raw: content,
            },
        }
    })
}

export function getAuthorBySlug(slug: string): Authors | undefined {
    const authors = getAllAuthors()
    return authors.find((a) => a.slug === slug)
}
