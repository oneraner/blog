import type { Blog, Authors } from '@/lib/types'

// CoreContent type - extracts essential fields from a document
export type CoreContent<T> = Omit<T, 'body'> & {
    readingTime?: Blog['readingTime']
    slug: string
    date: string
    path: string
    filePath: string
}

/**
 * Sort posts by date in descending order (newest first)
 */
export function sortPosts<T extends { date: string; draft?: boolean }>(
    posts: T[],
    dateKey: keyof T = 'date' as keyof T
): T[] {
    return posts
        .filter((post) => !post.draft)
        .sort((a, b) => {
            const dateA = new Date(a[dateKey] as string).getTime()
            const dateB = new Date(b[dateKey] as string).getTime()
            return dateB - dateA
        })
}

/**
 * Extract core content from a single post (removes body)
 */
export function coreContent<T extends { body: unknown }>(content: T): CoreContent<T> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { body, ...rest } = content
    return rest as CoreContent<T>
}

/**
 * Extract core content from all posts
 */
export function allCoreContent<T extends { body: unknown; draft?: boolean }>(
    contents: T[]
): CoreContent<T>[] {
    return contents.filter((c) => !c.draft).map((c) => coreContent(c))
}
