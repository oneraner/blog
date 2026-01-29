import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from '@/lib/utils/contentlayer'
import { getAllPosts } from '@/lib/content'
import tagData from 'app/tag-data.json'
import ListLayoutWithTags from '@/layouts/ListLayoutWithTags'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const allBlogs = getAllPosts()
  const paths: { tag: string; page: string }[] = []

  tagKeys.forEach((tag) => {
    const filteredPosts = allBlogs.filter(
      (post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)
    )
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
    for (let i = 1; i <= totalPages; i++) {
      paths.push({
        tag: encodeURI(tag),
        page: i.toString(),
      })
    }
  })

  return paths
}

export default async function Page(props: { params: Promise<{ tag: string; page: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const allBlogs = getAllPosts()

  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )
  const pageNumber = parseInt(params.page)
  const initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayoutWithTags
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}
