interface TocItem {
    value: string
    url: string
    depth: number
    children?: TocItem[]
}

interface TOCInlineProps {
    toc: TocItem[]
    fromHeading?: number
    toHeading?: number
    asDisclosure?: boolean
    exclude?: string | string[]
    collapse?: boolean
    ulClassName?: string
    liClassName?: string
}

function createNestedList(items: TocItem[]): TocItem[] {
    const nestedList: TocItem[] = []
    const stack: TocItem[] = []

    items.forEach((item) => {
        const newItem = { ...item }

        while (stack.length > 0 && stack[stack.length - 1].depth >= newItem.depth) {
            stack.pop()
        }

        const parent = stack.length > 0 ? stack[stack.length - 1] : null

        if (parent) {
            parent.children = parent.children || []
            parent.children.push(newItem)
        } else {
            nestedList.push(newItem)
        }

        stack.push(newItem)
    })

    return nestedList
}

function createList(items: TocItem[] | undefined, ulClassName: string, liClassName: string): React.ReactNode {
    if (!items || items.length === 0) {
        return null
    }

    return (
        <ul className={ulClassName}>
            {items.map((item, index) => (
                <li key={index} className={liClassName}>
                    <a href={item.url}>{item.value}</a>
                    {createList(item.children, ulClassName, liClassName)}
                </li>
            ))}
        </ul>
    )
}

export default function TOCInline({
    toc,
    fromHeading = 1,
    toHeading = 6,
    asDisclosure = false,
    exclude = '',
    collapse = false,
    ulClassName = '',
    liClassName = '',
}: TOCInlineProps) {
    const re = Array.isArray(exclude)
        ? new RegExp('^(' + exclude.join('|') + ')$', 'i')
        : new RegExp('^(' + exclude + ')$', 'i')

    const filteredToc = toc.filter(
        (heading) =>
            heading.depth >= fromHeading && heading.depth <= toHeading && !re.test(heading.value)
    )

    const nestedList = createNestedList(filteredToc)

    if (asDisclosure) {
        return (
            <details open={!collapse}>
                <summary className="ml-6 cursor-pointer pb-2 pt-2 text-xl font-bold">
                    Table of Contents
                </summary>
                <div className="ml-6">{createList(nestedList, ulClassName, liClassName)}</div>
            </details>
        )
    }

    return <>{createList(nestedList, ulClassName, liClassName)}</>
}
