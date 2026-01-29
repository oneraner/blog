'use client'

import { useState, useCallback } from 'react'

export default function PreCopyButton() {
    const [copied, setCopied] = useState(false)

    const handleCopy = useCallback(() => {
        // Find the parent pre element and copy its text
        const button = document.activeElement as HTMLButtonElement
        const pre = button?.parentElement?.querySelector('pre')
        if (pre?.textContent) {
            navigator.clipboard.writeText(pre.textContent)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }, [])

    return (
        <button
            aria-label="Copy code"
            className={`absolute right-2 top-2 z-10 h-8 w-8 rounded border-2 bg-gray-700 p-1 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-800 ${copied
                    ? 'border-green-400 focus:border-green-400 focus:outline-none'
                    : 'border-gray-300'
                }`}
            onClick={handleCopy}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
                className={copied ? 'text-green-400' : 'text-gray-300'}
            >
                {copied ? (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                ) : (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                )}
            </svg>
        </button>
    )
}
