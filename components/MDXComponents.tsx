import type { MDXComponents } from 'mdx/types'
import TOCInline from './TOCInline'
import Pre from './Pre'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
}
