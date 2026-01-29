import { writeFileSync, readdirSync, readFileSync, mkdirSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import matter from 'gray-matter'
import rss from './rss.mjs'

const outputFolder = process.env.EXPORT ? 'out' : 'public'

// Read all blog posts
function getAllPosts() {
  const blogDir = path.join(process.cwd(), 'data', 'blog')
  const files = readdirSync(blogDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))

  return files.map((filename) => {
    const fullPath = path.join(blogDir, filename)
    const fileContents = readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)
    const postSlug = filename.replace(/\.mdx?$/, '')

    return {
      title: data.title,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
      tags: data.tags || [],
      draft: data.draft || false,
      summary: data.summary,
      slug: postSlug,
      path: `blog/${postSlug}`,
    }
  })
}

// Generate search.json for KBar
function generateSearchIndex() {
  const posts = getAllPosts()
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const searchData = posts.map((post) => ({
    path: post.path,
    title: post.title,
    summary: post.summary || '',
    tags: post.tags,
  }))

  mkdirSync(outputFolder, { recursive: true })
  writeFileSync(`./${outputFolder}/search.json`, JSON.stringify(searchData, null, 2))
  console.log('Search index generated...')
}

// Generate tag-data.json
function generateTagData() {
  const posts = getAllPosts().filter((post) => !post.draft)
  const tagCount = {}

  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        const tagSlug = slug(tag)
        tagCount[tagSlug] = (tagCount[tagSlug] || 0) + 1
      })
    }
  })

  writeFileSync('./app/tag-data.json', JSON.stringify(tagCount, null, 2))
  console.log('Tag data generated...')
}

async function postbuild() {
  generateTagData()
  generateSearchIndex()
  await rss()
}

postbuild()
