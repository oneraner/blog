import { sortPosts, allCoreContent } from '@/lib/utils/contentlayer'
import { getAllPosts } from '@/lib/content'
import Main from './Main'

export default async function Page() {
  const allBlogs = getAllPosts()
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
