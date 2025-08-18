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
    // Query without filters first to see what we get
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
      // Temporarily remove filter and sort to debug
      // We'll add them back once we know the exact property names
    });

    const posts: BlogPost[] = [];

    for (const page of response.results) {
      if ("properties" in page) {
        // Try different possible property names
        const titleProp = page.properties.Title || page.properties.title || page.properties.Name || page.properties.name;
        const slugProp = page.properties.Slug || page.properties.slug;
        const dateProp = page.properties.date || page.properties.Date || page.properties.created_time;
        const summaryProp = page.properties.Summary || page.properties.summary || page.properties.Description || page.properties.description;
        const publishedProp = page.properties.Published || page.properties.published || page.properties.Status || page.properties.status;

        // Check if should be published (if property exists)
        if (publishedProp) {
          // Handle different property types
          if (publishedProp.type === "checkbox" && !publishedProp.checkbox) {
            continue; // Skip if not checked
          } else if (publishedProp.type === "select" && publishedProp.select?.name !== "Published") {
            continue; // Skip if not "Published" status
          }
        }

        // Extract title
        let title = "Untitled";
        if (titleProp?.type === "title" && titleProp.title?.length > 0) {
          title = titleProp.title[0].plain_text;
        }

        // Extract slug - if no slug property, generate from title
        let slug = "";
        if (slugProp?.type === "rich_text" && slugProp.rich_text?.length > 0) {
          slug = slugProp.rich_text[0].plain_text;
        } else if (slugProp?.type === "formula" && slugProp.formula?.string) {
          slug = slugProp.formula.string;
        } else {
          // Generate slug from title
          slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        }

        // Extract date
        let publishedAt = new Date().toISOString();
        if (dateProp?.type === "date" && dateProp.date) {
          publishedAt = dateProp.date.start;
        } else if (dateProp?.type === "created_time") {
          publishedAt = dateProp.created_time;
        }

        // Extract summary
        let summary = "";
        if (summaryProp?.type === "rich_text" && summaryProp.rich_text?.length > 0) {
          summary = summaryProp.rich_text[0].plain_text;
        }

        posts.push({
          id: page.id,
          title,
          slug: slug || page.id, // Use page ID as fallback
          publishedAt,
          summary,
        });
      }
    }

    // Sort by date descending
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

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
    // First get all posts and find the one with matching slug
    const posts = await getBlogPosts();
    const postMeta = posts.find(p => p.slug === slug);
    
    if (!postMeta) {
      return null;
    }

    // Fetch page content blocks
    const blocks = await notion.blocks.children.list({
      block_id: postMeta.id,
    });

    // Convert blocks to HTML (simplified for now)
    let content = "";
    for (const block of blocks.results) {
      const b = block as any;
      if ("type" in b) {
        if (b.type === "paragraph" && b.paragraph?.rich_text) {
          const text = b.paragraph.rich_text.map((t: any) => t.plain_text).join("");
          content += `<p>${text}</p>\n`;
        } else if (b.type === "heading_1" && b.heading_1?.rich_text) {
          const text = b.heading_1.rich_text.map((t: any) => t.plain_text).join("");
          content += `<h1>${text}</h1>\n`;
        } else if (b.type === "heading_2" && b.heading_2?.rich_text) {
          const text = b.heading_2.rich_text.map((t: any) => t.plain_text).join("");
          content += `<h2>${text}</h2>\n`;
        } else if (b.type === "heading_3" && b.heading_3?.rich_text) {
          const text = b.heading_3.rich_text.map((t: any) => t.plain_text).join("");
          content += `<h3>${text}</h3>\n`;
        } else if (b.type === "bulleted_list_item" && b.bulleted_list_item?.rich_text) {
          const text = b.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join("");
          content += `<ul><li>${text}</li></ul>\n`;
        } else if (b.type === "numbered_list_item" && b.numbered_list_item?.rich_text) {
          const text = b.numbered_list_item.rich_text.map((t: any) => t.plain_text).join("");
          content += `<ol><li>${text}</li></ol>\n`;
        } else if (b.type === "code" && b.code?.rich_text) {
          const text = b.code.rich_text.map((t: any) => t.plain_text).join("");
          const language = b.code.language || "";
          content += `<pre><code class="language-${language}">${text}</code></pre>\n`;
        }
      }
    }

    return {
      ...postMeta,
      content,
    };
  } catch (error) {
    console.error("Error fetching blog post from Notion:", error);
    return null;
  }
}