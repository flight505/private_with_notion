Personal website spec that sells me as a high-value biotech/AI hire. 

Product brief — Jesper Vang Portfolio (Biotech + AI)

Positioning (what the site must convey in 15 seconds)
	•	You turn clinical/omics time-series and biotech workflows into operational ML tools.
	•	You ship: models, dashboards, pipelines, plus usable docs.
	•	You quantify value (time saved, accuracy lifted, risk reduced).

Homepage one-liner

Bioinformatics Engineer & AI Developer — building decision tools from clinical and omics data.

3 proof points (to fill with real numbers)
	•	⏱ X% faster preprocessing for dataset Y.
	•	🎯 +0.0Z AUROC on task/problem.
	•	💸 Saved N hours/week for role/team.

⸻

Outcomes & KPIs (what “good” looks like)
	•	Hiring signals: role clarity, evidence of delivery, metrics, industry vocabulary.
	•	Contact conversion: ≥ 3% visit → inquiry, ≥ 15% on project pages.
	•	Credibility: at least 4 case studies with quantified outcomes, 2+ short technical posts.
	•	Findability: search for “Jesper Vang bioinformatics / AI developer” yields the site.

⸻

Information architecture (crawlable, recruiter-friendly)
	•	Home (hero, 3 featured case studies, recent writing, logos/affiliations, CTA row)
	•	Projects (filterable grid)
	•	Project detail (case-study template below)
	•	Publications (blog from Notion; 3 categories)
	•	About (short bio, competencies, stack)
	•	Contact (form + availability)

⸻

Content blueprints (fill-in templates)

Case-study template (one page per project)
	•	Hero: Title, 1-line outcome, tags (Domain, Modality), quick links (Code / Demo / PDF).
	•	Problem: 3–5 lines with business/clinical context and constraints (data volume, latency, privacy).
	•	Approach: methods, architecture, datasets, validation (diagram if relevant).
	•	Results: headline metrics with chart/screenshot; compare to baseline.
	•	Impact: who benefited, time saved, decisions enabled, deployment footprint.
	•	Tech stack: badges (ML, infra, frontend).
	•	Ethics & data: de-identification, compliance posture.
	•	Role & collaborators: your scope; credit others fairly.
	•	Next steps: what you’d improve.

Blog post template
	•	Type: Technical Insight / Industry Analysis / Deep Dive
	•	Promise: 1-sentence takeaway; TL;DR block with 3 bullets.
	•	Body: headers, code, figures; 6–10 min read.
	•	Close: “If you’re tackling X, here’s how I’d approach it.”

About
	•	Short bio (4–6 lines) highlighting capabilities not credentials.
	•	Competencies (bullet list): Time-series ML, Genomics/Bioinfo pipelines, Clinical data standards, Visualization/UX, MLOps.
	•	Tooling: PyTorch/Lightning, scikit-learn/XGBoost, Next.js, D3/Plotly, Notion API, Apple Metal (M3 Max).

Contact
	•	Form (name, org, email, topic, message) + availability tag.
	•	Links: LinkedIn, GitHub, Google Scholar/ORCID (if used).
	•	Optional: “Book a 20-min intro” link (Calendly/Cal.com).

⸻

Narrative strategy (addressing the failed PhD)
	•	Do not mention “failed”. State: “Doctoral research in bioinformatics (thesis not defended).”
	•	Emphasize deliverables and impact over formal completion.
	•	Use case studies to show capability, momentum, and professional ethics.
	•	Add 1–2 testimonials (PI/lead/partner) as pull-quotes if available.

⸻

Notion as CMS — schemas (exact property names for AI coders)

Notion database: Projects
	•	Title (title)
	•	Slug (rich_text)
	•	Status (select: Published, Draft)
	•	Domain (multi_select: Drug Discovery, Bioprocess, Clinical, Genomics, Visualization)
	•	Modality (multi_select: Time-series, Tabular, Genomics, Imaging, Text)
	•	Tech Stack (multi_select)
	•	Problem (rich_text)
	•	Approach (rich_text)
	•	Results (rich_text)
	•	Impact (rich_text)
	•	Hero Image (files)
	•	Links (URL — GitHub / Demo / PDF)
	•	Featured (checkbox)
	•	Date (date)

Notion database: Blog
	•	Title (title)
	•	Slug (rich_text)
	•	Status (select: Published, Draft)
	•	Category (select: Technical Insight, Industry Analysis, Deep Dive)
	•	Summary (rich_text)
	•	Cover (files)
	•	Date (date)
	•	Reading Time (number)

Acceptance criteria: List pages in reverse-chronological order, filter Status = Published, support pagination (12/page).

⸻

Design system (professional, quiet, flexible)

Tokens
	•	Colors: brand.navy #1A365D, brand.teal #38B2AC, ink #111827, muted #6B7280, surface #FFFFFF, bg #F8FAFC.
	•	Type: Inter for UI and body; 16px base; scale: 16/18/24/32/40.
	•	Spacing: 8px grid; section paddings 48–80px.
	•	Radii: 8px; Shadows: subtle 1–2dp.
	•	Iconography: react-icons (Feather/Lucide style).

Components to build
	•	Navbar, Footer, SectionHeader
	•	ProjectCard (props: title, summary, tags, metric, href, image)
	•	MetricBadge (label, value, context)
	•	TagPill (clickable filters)
	•	PostCard
	•	ContactForm (w/ validation, success state)
	•	TestimonialQuote
	•	CodeBlock, Figure, Callout

Acceptance criteria: All components keyboard-navigable; focus states visible; color contrast ≥ 4.5:1 on text.

⸻

Tech stack (flexible, current-docs driven)

Preferred
	•	Next.js 14 (App Router) + TypeScript
	•	Tailwind CSS + shadcn/ui (copy-in components; no heavy runtime deps)
	•	@notionhq/client for data
	•	next/image for optimized media
	•	Vercel (preview deployments per PR)
	•	Email: Resend API or SendGrid for /api/contact

Optional / pluggable
	•	Content renderer: notion-to-md or react-notion-x
	•	Charts: visx / react-plotly.js
	•	Analytics: Vercel Analytics + Plausible/Umami
	•	Search: client Fuse.js (no infra), or Algolia later
	•	PDFs: generate 1-pager project sheets via MDX→PDF or Typst

Env vars

NOTION_TOKEN=
NOTION_PROJECTS_DB_ID=
NOTION_BLOG_DB_ID=
RESEND_API_KEY=            # or SENDGRID_API_KEY
SITE_URL=                  # e.g., https://jespervang.dk


⸻

SEO, OG & schema checklist
	•	Unique <title> (≤60 chars) & meta description (≤160) per page.
	•	Canonical URLs; sitemap.xml & robots.txt.
	•	OpenGraph/Twitter images (1200×630) — per project/post.
	•	JSON-LD:
	•	Person on Home/About.
	•	Article on blog posts.
	•	CreativeWork/Project on project pages.
	•	Fast LCP: hero image optimized; avoid large blocking scripts.

⸻

Accessibility & performance checklist
	•	Keyboard navigation end-to-end; skip-to-content link.
	•	Alt text on all figures; descriptive link text.
	•	prefers-reduced-motion respected.
	•	Lighthouse goals: Perf ≥ 90, A11y ≥ 95, SEO ≥ 95 on mobile.

⸻

Analytics & conversion
	•	Events:
	•	cta_home_projects_click
	•	project_view (slug)
	•	project_demo_click / project_code_click
	•	cv_download_click
	•	contact_submit
	•	Funnels:
	•	Home → Project → Contact
	•	Home → Blog → Contact
	•	UTM handling on outbound links to demos/GitHub.

⸻

Risk controls (things to avoid)
	•	No overlays for full articles/case studies (hurt SEO/sharing).
	•	No references to “failed PhD.” Keep tone forward-looking.
	•	No demo links that require login or are broken.
	•	No unverifiable claims; metrics must be reproducible or clearly labeled as pilot.

⸻

AI-coder task matrix (prompts + acceptance criteria)

Task 1 — Scaffold & theme
	•	Prompt essentials: Next.js 14 App Router TS project, Tailwind + shadcn init, tokens above, base layout, <Navbar/>, <Footer/>.
	•	Accept: Compiles, dark-on-light palette, responsive nav, Lighthouse Perf ≥ 90 on skeleton.

Task 2 — Notion client & typing
	•	Prompt essentials: Add @notionhq/client, create lib/notion.ts with typed fetchers for Projects and Blog using the schemas above; filter Status = Published, sort by Date.
	•	Accept: Type-safe return models; throws helpful errors if envs missing.

Task 3 — Projects index
	•	Prompt essentials: app/projects/page.tsx list; server component; filter pills (Domain/Modality); pagination (12/page).
	•	Accept: Filters combine (AND), URL state in querystring, fast render, empty states.

Task 4 — Project detail
	•	Prompt essentials: app/projects/[slug]/page.tsx; map Notion rich text to components; hero with metric badges; image gallery; Code/Demo/PDF buttons.
	•	Accept: Loads via generateStaticParams; revalidate hourly; valid OG image.

Task 5 — Blog index & post
	•	Prompt essentials: app/blog/page.tsx, app/blog/[slug]/page.tsx; categories, reading time, code styling.
	•	Accept: Mobile typography readable, images responsive, prev/next links.

Task 6 — Home
	•	Prompt essentials: Hero (headline, subhead, 3 proof badges), featured 3 projects (Notion Featured = true), 3 recent posts, CTA row.
	•	Accept: LCP < 2.5s mobile; all CTAs tracked.

Task 7 — Contact
	•	Prompt essentials: Form with Zod validation; /api/contact using Resend; success & error states; rate-limit + honeypot.
	•	Accept: Delivers email in test; graceful error UX.

Task 8 — SEO/Schema
	•	Prompt essentials: metadata exports per route; JSON-LD for Person/Article/Project; sitemap.ts, robots.txt.
	•	Accept: Rich-result validator passes; titles & descriptions unique.

Task 9 — Analytics
	•	Prompt essentials: Vercel Analytics + optional Plausible; event hooks on CTAs.
	•	Accept: Events visible in dashboard; anonymized IP.

Task 10 — A11y & perf pass
	•	Prompt essentials: Keyboard nav, focus rings, reduced motion; image optimization; route segment caching.
	•	Accept: Lighthouse targets met on mobile.

⸻

Content to prepare (from you)
	•	4 case studies with real numbers (even approximate but honest).
	•	2 short blog posts (Technical Insight, Deep Dive).
	•	1 professional headshot, SVG logo/wordmark (optional).
	•	PDF CV (I can help condense into a 1-pager later).
	•	Company/affiliation logos you’re allowed to show.

⸻

Roadmap
	•	v1.0: Home, Projects (+4), Blog (+2), About, Contact, Analytics, SEO.
	•	v1.1: RSS, site search, 1-pager PDF case-study export, testimonials.
	•	v2.0: EN/DA i18n, Algolia search, ORCID/Scholar integration, demo hosting matrix.

⸻