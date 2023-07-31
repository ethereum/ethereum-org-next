import { Box, Divider as ChakraDivider, Flex, Heading, Text, chakra } from "@chakra-ui/react"
import { ParsedUrlQuery } from "querystring"
import { MDXRemote } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import remarkGfm from "remark-gfm"

import InfoBanner from "@/components/InfoBanner"
import Link from "@/components/Link"
import MarkdownTable from "@/components/MarkdownTable"

import { getContent, getContentBySlug } from "@/lib/utils/md"

import { GetStaticPaths, GetStaticProps, NextPage } from "next/types"
import { ChildOnlyProp } from "@/lib/types"

interface Params extends ParsedUrlQuery {
  slug: string[]
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
          // Splitting nested paths to generate proper slug
          slug: file.slug.split("/").slice(1),
        },
      }
    }),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
  const params = context.params!
  const markdown = getContentBySlug(params.slug.join("/"), ["slug", "content"])
  // TODO: check if content type can be fixed
  const content = (await serialize(markdown.content, {
    mdxOptions: {
      // Required since MDX v2 to compile tables (see https://mdxjs.com/migrating/v2/#gfm)
      remarkPlugins: [remarkGfm],
    },
  })) as any

  return {
    props: {
      content,
    },
  }
}

const HR = () => <ChakraDivider mt={8} mb={4} display="inline-block" position="inherit" bg="border" />

const Divider = () => <Box my={16} w="10%" h={1} bgColor="homeDivider" />

const Header1 = (props: ChildOnlyProp) => (
  <Heading
    as="h1"
    fontSize={{ base: "2.5rem", md: "5xl" }}
    lineHeight={1.4}
    fontWeight="bold"
    _before={{
      content: `""`,
      display: "block",
      h: "140px",
      mt: "-140px",
      visibility: "hidden",
    }}
    sx={{
      a: {
        display: "none",
      },
    }}
    {...props}
  />
)

const Header2 = (props: ChildOnlyProp) => (
  <Heading
    fontSize={{ base: "2xl", md: "2rem" }}
    lineHeight={1.4}
    fontWeight="bold"
    sx={{ position: "inherit !important" }}
    _before={{
      content: `""`,
      display: "block",
      h: "120px",
      mt: "-120px",
      visibility: "hidden",
    }}
    {...props}
  />
)

const Header3 = (props: ChildOnlyProp) => (
  <Heading
    as="h3"
    fontSize={{ base: "xl", md: "2xl" }}
    lineHeight={1.4}
    sx={{ position: "inherit !important" }}
    _before={{
      content: `""`,
      display: "block",
      h: "120px",
      mt: "-120px",
      visibility: "hidden",
    }}
    {...props}
  />
)

const Header4 = (props: ChildOnlyProp) => (
  <Heading
    as="h4"
    fontSize={{ base: "md", md: "xl" }}
    lineHeight={1.4}
    fontWeight="semibold"
    sx={{ position: "unset !important" }}
    _before={{
      content: `""`,
      display: "block",
      h: "120px",
      mt: "-120px",
      visibility: "hidden",
    }}
    {...props}
  />
)

const Paragraph = (props: ChildOnlyProp) => <Text fontSize="md" mt={8} mb={4} color="text300" {...props} />

const ListItem = (props: ChildOnlyProp) => <chakra.li color="text300" {...props} />

const components = {
  a: Link,
  h1: Header1,
  h2: Header2,
  h3: Header3,
  h4: Header4,
  p: Paragraph,
  li: ListItem,
  hr: HR,
  table: MarkdownTable,
  Link,
  Divider,
  InfoBanner,
}

const ContentPage: NextPage<Props> = ({ content }) => {
  return (
    <Box w="full">
      <Flex
        justifyContent="space-between"
        w="full"
        mx="auto"
        mb={16}
        p={8}
        pt={{ base: 8, lg: 16 }}
        // dir={isRightToLeft ? "rtl" : "ltr"}
      >
        <Box
          as="article"
          maxW="container.md"
          w="full"
          sx={{
            ".featured": {
              pl: 4,
              ml: -4,
              borderLeft: "1px dotted",
              borderLeftColor: "primary.base",
            },

            ".citation": {
              p: {
                color: "text200",
              },
            },
          }}
        >
          {/* TODO: check if content type can be fixed */}
          <MDXRemote {...(content as any)} components={components} />
        </Box>
      </Flex>
    </Box>
  )
}

export default ContentPage
