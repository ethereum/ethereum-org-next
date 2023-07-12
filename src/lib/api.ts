import fs from "fs"
import { join } from "path"
import matter from "gray-matter"

import { CONTENT_DIR } from "./constants"

const contentDir = join(process.cwd(), CONTENT_DIR)

export const getPostSlugs = () => {
  return fs.readdirSync(contentDir)
}

export const getContentBySlug = (slug: string, fields: string[] = []) => {
  const realSlug = slug.replace(/\.md$/, "")
  const fullPath = join(contentDir, `${realSlug}/index.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug
    }
    if (field === "content") {
      items[field] = content
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field]
    }
  })

  return items
}

export const getContent = (fields: string[] = []) => {
  const slugs = getPostSlugs()
  const content = slugs.map((slug) => getContentBySlug(slug, fields))

  return content
}
