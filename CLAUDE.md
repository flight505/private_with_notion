# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a portfolio website for Jesper Vang, positioned as a Bioinformatics Engineer & AI Developer. The site showcases expertise in turning clinical/omics time-series and biotech workflows into operational ML tools.

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **CMS**: Notion API as backend (@notionhq/client)
- **Deployment**: Vercel
- **Email**: Resend API or SendGrid for contact form
- **Analytics**: Vercel Analytics + optional Plausible/Umami

## Key Commands

```bash
# Development
npm run dev           # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check

# Testing
npm test             # Run test suite
npm run test:watch   # Run tests in watch mode

# Deployment
vercel               # Deploy to Vercel
vercel --prod        # Deploy to production
```

## Architecture & Structure

### Data Flow
1. **Notion as CMS**: Two main databases (Projects and Blog) with defined schemas
2. **Static Generation**: Pages pre-rendered at build time using `generateStaticParams`
3. **ISR**: Hourly revalidation for fresh content
4. **Type Safety**: Fully typed Notion responses and data models

### Core Routes
- `/` - Homepage with hero, featured projects, recent posts
- `/projects` - Filterable project grid (Domain/Modality filters)
- `/projects/[slug]` - Individual project case studies
- `/blog` - Blog listing with categories
- `/blog/[slug]` - Individual blog posts
- `/about` - Bio and competencies
- `/contact` - Contact form with validation

### Notion Database Schemas

**Projects Database**:
- Title, Slug, Status (Published/Draft)
- Domain (multi_select): Drug Discovery, Bioprocess, Clinical, Genomics, Visualization
- Modality (multi_select): Time-series, Tabular, Genomics, Imaging, Text
- Tech Stack (multi_select)
- Problem, Approach, Results, Impact (rich_text)
- Hero Image, Links (GitHub/Demo/PDF)
- Featured (checkbox), Date

**Blog Database**:
- Title, Slug, Status (Published/Draft)
- Category: Technical Insight, Industry Analysis, Deep Dive
- Summary, Cover, Date, Reading Time

### Design System Tokens

```css
Colors:
- brand.navy: #1A365D
- brand.teal: #38B2AC
- ink: #111827
- muted: #6B7280
- surface: #FFFFFF
- bg: #F8FAFC

Typography:
- Font: Inter
- Base: 16px
- Scale: 16/18/24/32/40

Spacing: 8px grid
Radius: 8px
```

## Critical Implementation Notes

1. **Status Filtering**: Always filter Notion queries for `Status = "Published"`
2. **Error Handling**: Provide helpful errors when environment variables are missing
3. **Type Safety**: Use TypeScript strictly - no `any` types
4. **Performance**: Lighthouse targets: Perf ≥ 90, A11y ≥ 95, SEO ≥ 95
5. **Accessibility**: All components must be keyboard navigable with visible focus states
6. **SEO**: Unique meta tags per page, JSON-LD structured data, OG images

## Environment Variables

```env
NOTION_TOKEN=             # Notion integration token
NOTION_PROJECTS_DB_ID=    # Projects database ID
NOTION_BLOG_DB_ID=        # Blog database ID
RESEND_API_KEY=          # Email service API key (or SENDGRID_API_KEY)
SITE_URL=                # Production URL (e.g., https://jespervang.dk)
```

## Analytics Events to Track

- `cta_home_projects_click`
- `project_view` (with slug)
- `project_demo_click` / `project_code_click`
- `cv_download_click`
- `contact_submit`

## Content Handling Guidelines

1. **Case Studies**: Follow the template with Problem, Approach, Results, Impact sections
2. **Metrics**: Always quantify outcomes (time saved, accuracy lifted, risk reduced)
3. **PhD Reference**: State as "Doctoral research in bioinformatics (thesis not defended)" - never use "failed"
4. **Rich Text**: Convert Notion blocks to appropriate React components
5. **Images**: Use next/image with optimization, ensure alt text for accessibility

## Component Library Requirements

Build these reusable components:
- Navbar, Footer, SectionHeader
- ProjectCard (title, summary, tags, metric, href, image)
- MetricBadge (label, value, context)
- TagPill (clickable filters with URL state)
- PostCard, ContactForm (with Zod validation)
- TestimonialQuote, CodeBlock, Figure, Callout

## Development Workflow

1. Start with fetching and typing Notion data (`lib/notion.ts`)
2. Build static pages with ISR for dynamic content
3. Implement filtering with URL state preservation
4. Add analytics tracking on all CTAs
5. Ensure responsive design and accessibility
6. Optimize for Core Web Vitals

## Testing Checklist

- [ ] All Notion queries handle missing/draft content gracefully
- [ ] Forms validate and show appropriate error states
- [ ] Filters work correctly and update URL state
- [ ] Mobile responsive at all breakpoints
- [ ] Keyboard navigation works throughout
- [ ] Analytics events fire correctly
- [ ] Email delivery works in production
- [ ] Build succeeds with proper type checking