import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { getBlogPosts as getNotionPosts, getPost as getNotionPost } from "@/lib/notion";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      // https://rehype-pretty.pages.dev/#usage
      theme: {
        light: "min-light",
        dark: "min-dark",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return p.toString();
}

export async function getPost(slug: string) {
  // First try to get from Notion
  const notionPost = await getNotionPost(slug);
  if (notionPost && notionPost.content) {
    return {
      source: notionPost.content,
      metadata: {
        title: notionPost.title,
        publishedAt: notionPost.publishedAt,
        summary: notionPost.summary,
        image: notionPost.image,
      },
      slug,
    };
  }

  // Fallback to MDX files
  const filePath = path.join("content", `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    let source = fs.readFileSync(filePath, "utf-8");
    const { content: rawContent, data: metadata } = matter(source);
    const content = await markdownToHTML(rawContent);
    return {
      source: content,
      metadata,
      slug,
    };
  }

  // If neither exists, return null or throw error
  throw new Error(`Post with slug "${slug}" not found`);
}

async function getAllPosts(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(async (file) => {
      let slug = path.basename(file, path.extname(file));
      let { metadata, source } = await getPost(slug);
      return {
        metadata,
        slug,
        source,
      };
    }),
  );
}

export async function getBlogPosts() {
  // Get posts from Notion
  const notionPosts = await getNotionPosts();
  
  // Get posts from MDX files
  const mdxPosts = await getAllPosts(path.join(process.cwd(), "content"));
  
  // Combine and return all posts, Notion posts take precedence
  const allPosts = [
    ...notionPosts.map(post => ({
      metadata: {
        title: post.title,
        publishedAt: post.publishedAt,
        summary: post.summary,
        image: post.image,
      },
      slug: post.slug,
      source: post.content || "",
    })),
    ...mdxPosts,
  ];
  
  // Remove duplicates based on slug (Notion takes precedence)
  const uniquePosts = allPosts.filter((post, index, self) => 
    index === self.findIndex(p => p.slug === post.slug)
  );
  
  return uniquePosts;
}
