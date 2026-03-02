'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    KBarProvider,
    KBarPortal,
    KBarPositioner,
    KBarAnimator,
    KBarSearch,
    KBarResults,
    useMatches,
    Action,
} from 'kbar'
import siteMetadata from '@/data/siteMetadata'

interface SearchProviderProps {
    children: ReactNode
}

function RenderResults() {
    const { results } = useMatches()

    return (
        <KBarResults
            items={results}
            onRender={({ item, active }) =>
                typeof item === 'string' ? (
                    <div className="px-4 py-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                        {item}
                    </div>
                ) : (
                    <div
                        className={`flex cursor-pointer items-center justify-between px-4 py-3 ${active ? 'bg-primary-500 text-white' : 'bg-transparent text-gray-700 dark:text-gray-100'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {item.icon && <span>{item.icon}</span>}
                            <span>{item.name}</span>
                        </div>
                        {item.subtitle && (
                            <span className={`text-sm ${active ? 'text-white' : 'text-gray-400'}`}>
                                {item.subtitle}
                            </span>
                        )}
                    </div>
                )
            }
        />
    )
}

export default function SearchProvider({ children }: SearchProviderProps) {
    const router = useRouter()
    const [searchActions, setSearchActions] = useState<Action[]>([])

    useEffect(() => {
        async function loadSearchData() {
            try {
                const searchDocumentsPath = siteMetadata.search?.kbarConfig?.searchDocumentsPath
                if (!searchDocumentsPath) return

                const res = await fetch(searchDocumentsPath)
                const data = await res.json()

                const actions: Action[] = data.map((post: { path: string; title: string; summary?: string; tags?: string[] }) => ({
                    id: post.path,
                    name: post.title,
                    subtitle: post.summary || '',
                    section: 'Blog',
                    keywords: post.tags?.join(' ') || '',
                    perform: () => router.push(`/${post.path}`),
                }))

                setSearchActions(actions)
            } catch (error) {
                console.error('Failed to load search data:', error)
            }
        }

        loadSearchData()
    }, [router])

    const defaultActions: Action[] = [
        {
            id: 'home',
            name: 'Home',
            section: 'Navigation',
            shortcut: ['h'],
            perform: () => router.push('/'),
        },
        {
            id: 'blog',
            name: 'Blog',
            section: 'Navigation',
            shortcut: ['b'],
            perform: () => router.push('/blog'),
        },
        {
            id: 'about',
            name: 'About',
            section: 'Navigation',
            shortcut: ['a'],
            perform: () => router.push('/about'),
        },
    ]

    return (
        <KBarProvider actions={[...defaultActions, ...searchActions]}>
            <KBarPortal>
                <KBarPositioner className="z-50 bg-gray-300/50 p-4 backdrop-blur-sm backdrop-filter dark:bg-black/50">
                    <KBarAnimator className="w-full max-w-xl overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                        <KBarSearch className="w-full border-none bg-transparent px-4 py-3 text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-200" />
                        <div className="border-t border-gray-100 dark:border-gray-800">
                            <RenderResults />
                        </div>
                    </KBarAnimator>
                </KBarPositioner>
            </KBarPortal>
            {children}
        </KBarProvider>
    )
}
