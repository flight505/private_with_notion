import { Client } from "@notionhq/client";

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_BLOG_DB_ID;

// Type for our blog post metadata
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  summary: string;
  content?: string;
  image?: string;
};

// Fetch all published blog posts from Notion
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!databaseId) {
    console.warn("NOTION_BLOG_DB_ID not configured, returning empty array");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const posts: BlogPost[] = [];

    for (const page of response.results) {
      if ("properties" in page) {
        const titleProp = page.properties.Title as any;
        const slugProp = page.properties.Slug as any;
        const dateProp = page.properties.Date as any;
        const summaryProp = page.properties.Summary as any;

        // Extract title
        let title = "Untitled";
        if (titleProp?.type === "title" && titleProp.title?.length > 0) {
          title = titleProp.title[0].plain_text;
        }

        // Extract slug
        let slug = "";
        if (slugProp?.type === "rich_text" && slugProp.rich_text?.length > 0) {
          slug = slugProp.rich_text[0].plain_text;
        }

        // Extract date
        let publishedAt = new Date().toISOString();
        if (dateProp?.type === "date" && dateProp.date) {
          publishedAt = dateProp.date.start;
        }

        // Extract summary
        let summary = "";
        if (summaryProp?.type === "rich_text" && summaryProp.rich_text?.length > 0) {
          summary = summaryProp.rich_text[0].plain_text;
        }

        posts.push({
          id: page.id,
          title,
          slug,
          publishedAt,
          summary,
        });
      }
    }

    return posts;
  } catch (error) {
    console.error("Error fetching blog posts from Notion:", error);
    return [];
  }
}

// Fetch a single blog post with content
export async function getPost(slug: string): Promise<BlogPost | null> {
  if (!databaseId) {
    console.warn("NOTION_BLOG_DB_ID not configured");
    return null;
  }

  try {
    // First find the page with this slug
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0];
    if (!("properties" in page)) {
      return null;
    }

    // Extract metadata
    const titleProp = page.properties.Title;
    const slugProp = page.properties.Slug;
    const dateProp = page.properties.Date;
    const summaryProp = page.properties.Summary;

    let title = "Untitled";
    if (titleProp?.type === "title" && "title" in titleProp && titleProp.title.length > 0) {
      title = titleProp.title[0].plain_text;
    }

    let publishedAt = new Date().toISOString();
    if (dateProp?.type === "date" && "date" in dateProp && dateProp.date) {
      publishedAt = dateProp.date.start;
    }

    let summary = "";
    if (summaryProp?.type === "rich_text" && "rich_text" in summaryProp && summaryProp.rich_text.length > 0) {
      summary = summaryProp.rich_text[0].plain_text;
    }

    // Fetch page content blocks
    const blocks = await notion.blocks.children.list({
      block_id: page.id,
    });

    // Convert blocks to HTML (simplified for now)
    let content = "";
    for (const block of blocks.results) {
      if ("type" in block) {
        if (block.type === "paragraph" && block.paragraph?.rich_text) {
          const text = block.paragraph.rich_text.map(t => t.plain_text).join("");
          content += `<p>${text}</p>\n`;
        } else if (block.type === "heading_1" && block.heading_1?.rich_text) {
          const text = block.heading_1.rich_text.map(t => t.plain_text).join("");
          content += `<h1>${text}</h1>\n`;
        } else if (block.type === "heading_2" && block.heading_2?.rich_text) {
          const text = block.heading_2.rich_text.map(t => t.plain_text).join("");
          content += `<h2>${text}</h2>\n`;
        } else if (block.type === "heading_3" && block.heading_3?.rich_text) {
          const text = block.heading_3.rich_text.map(t => t.plain_text).join("");
          content += `<h3>${text}</h3>\n`;
        } else if (block.type === "bulleted_list_item" && block.bulleted_list_item?.rich_text) {
          const text = block.bulleted_list_item.rich_text.map(t => t.plain_text).join("");
          content += `<ul><li>${text}</li></ul>\n`;
        } else if (block.type === "numbered_list_item" && block.numbered_list_item?.rich_text) {
          const text = block.numbered_list_item.rich_text.map(t => t.plain_text).join("");
          content += `<ol><li>${text}</li></ol>\n`;
        } else if (block.type === "code" && block.code?.rich_text) {
          const text = block.code.rich_text.map(t => t.plain_text).join("");
          const language = block.code.language || "";
          content += `<pre><code class="language-${language}">${text}</code></pre>\n`;
        }
      }
    }

    return {
      id: page.id,
      title,
      slug,
      publishedAt,
      summary,
      content,
    };
  } catch (error) {
    console.error("Error fetching blog post from Notion:", error);
    return null;
  }
}