# How to Set Up Your Notion Database for the Blog

## Required Database Properties

Your Notion database needs these properties for the blog to work:

### 1. Title Property
- **Property Name**: Can be "Title", "Name", or similar
- **Type**: Title
- **Purpose**: The blog post title

### 2. Date Property (Optional but recommended)
- **Property Name**: Can be "date", "Date", or use Created Time
- **Type**: Date or Created Time
- **Purpose**: When the post was published

### 3. Slug Property (Optional)
- **Property Name**: "Slug" or "slug"
- **Type**: Text or Formula
- **Purpose**: URL-friendly version of title (e.g., "my-first-post")
- **Note**: If not provided, will be auto-generated from title

### 4. Summary Property (Optional)
- **Property Name**: "Summary", "Description", or similar
- **Type**: Text
- **Purpose**: Short description for blog listing

### 5. Published Property (Optional)
- **Property Name**: "Published", "Status", or similar
- **Type**: Checkbox OR Select
- **Purpose**: Control which posts are visible
- **Note**: If using Select, create an option called "Published"

## Quick Setup Steps

1. **Open your Notion database**: https://www.notion.so/1cd796b2db0d80eaaf57dcb497fc16f7

2. **Check what properties you already have** - Click on the "..." menu → Properties

3. **Add any missing properties**:
   - Click "+ Add a property"
   - Name it and choose the type from above

4. **For your existing blog posts**:
   - Make sure they have a title
   - If using Published field, check the box or set to "Published"
   - Add a slug (or let it auto-generate)

## Example Database Structure

| Title | date | Slug | Summary | Published |
|-------|------|------|---------|-----------|
| My First Post | 2024-01-15 | my-first-post | Introduction to my blog | ✓ |
| Second Post | 2024-01-20 | second-post | Another great article | ✓ |

## Test Your Setup

After setting up your database:
1. Wait 2-3 minutes for Vercel to rebuild
2. Visit jespervang.dk/blog
3. Your Notion posts should appear!

## Troubleshooting

If posts still don't appear:
- Make sure at least one post has content (not just the title)
- Check that the integration has access (Share button → Your integration should be listed)
- Look at the browser console for any errors

The current code is flexible and will work with various property names, so you don't need exact matches.