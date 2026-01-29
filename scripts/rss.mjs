import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import matter from 'gray-matter'
import siteMetadata from '../data/siteMetadata.js'
import tagData from '../app/tag-data.json' with { type: 'json' }

const outputFolder = process.env.EXPORT ? 'out' : 'public'

// Simple HTML escape
function escape(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

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
    }
  })
}

// Sort posts by date
function sortPosts(posts) {
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (config, posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publishPosts = allBlogs.filter((post) => post.draft !== true)
  // RSS for blog post
  if (publishPosts.length > 0) {
    const rss = generateRss(config, sortPosts(publishPosts))
    writeFileSync(`./${outputFolder}/${page}`, rss)
  }

  if (publishPosts.length > 0) {
    for (const tag of Object.keys(tagData)) {
      const filteredPosts = allBlogs.filter((post) => post.tags.map((t) => slug(t)).includes(tag))
      if (filteredPosts.length > 0) {
        const rss = generateRss(config, sortPosts(filteredPosts), `tags/${tag}/${page}`)
        const rssPath = path.join(outputFolder, 'tags', tag)
        mkdirSync(rssPath, { recursive: true })
        writeFileSync(path.join(rssPath, page), rss)
      }
    }
  }
}

const rss = () => {
  const allBlogs = getAllPosts()
  generateRSS(siteMetadata, allBlogs)
  console.log('RSS feed generated...')
}
export default rss
