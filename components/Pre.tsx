import { ReactNode } from 'react'
import PreCopyButton from './PreCopyButton'

interface PreProps {
    children: ReactNode
}

export default function Pre({ children }: PreProps) {
    return (
        <div className="group relative">
            <PreCopyButton />
            <pre>{children}</pre>
        </div>
    )
}
