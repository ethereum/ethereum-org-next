import { GetStaticPaths, GetStaticProps, NextPage } from "next/types"
import { ParsedUrlQuery } from "querystring"

import { getContent, getContentBySlug } from "@/lib/api"
import markdownToHtml from "@/lib/markdownToHtml"

interface Params extends ParsedUrlQuery {
  slug: string
}

interface Props {
  content: string
}

export const getStaticPaths: GetStaticPaths = () => {
  const contentFiles = getContent(["slug", "content"])

  return {
    paths: contentFiles.map((file) => {
      return {
        params: {
          slug: file.slug,
        },
      }
    }),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
  const params = context.params!
  const markdown = getContentBySlug(params.slug, ["slug", "content"])
  const content = await markdownToHtml(markdown.content)

  return {
    props: {
      content,
    },
  }
}

const ContentPage: NextPage<Props> = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: content }} />
}

export default ContentPage
