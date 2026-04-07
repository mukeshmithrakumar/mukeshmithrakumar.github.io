# Mukesh Mithrakumar Website

This repository contains my personal website and technical blog, built with Astro. It is where I publish projects, long-form notes, and writing across machine learning, computer vision, deep learning, and systems topics.

## Project Overview

The site is content-first, with most of the day-to-day work happening in the content and config layers:

- `src/data/blog/` stores blog posts and their local assets.
- `src/data/projects/` stores project entries showcased on the site.
- `src/data/authors/` and `src/data/otherPages/` hold supporting content collections.
- `src/config/siteData.json.ts` contains global site metadata, SEO defaults, and social links.
- `src/pages/`, `src/layouts/`, and `src/components/` make up the Astro page structure and reusable UI.
- `scripts/generate-social-previews.mjs` generates per-post social share images from frontmatter data.

## Local Development

Install dependencies once with `npm install`, then use the commands below from the project root.

| Command                         | Action                                                  |
| :------------------------------ | :------------------------------------------------------ |
| `npm run dev`                   | Start the local Astro dev server                        |
| `npm run build`                 | Build the production site into `dist/`                  |
| `npm run preview`               | Preview the built site locally                          |
| `npm run lint`                  | Run ESLint across the codebase                          |
| `npm run format`                | Format the repository with Prettier                     |
| `npm run generate:social-previews` | Generate blog social preview images manually         |

## Notes

- `npm run build` automatically runs social preview generation first through the `prebuild` hook.
- Blog posts should include frontmatter like `title`, `description`, `slug`, and `heroImage` so previews and metadata stay complete.
- Generated preview images are written to `public/social-previews/blog/`.


## Social Preview Generation

`npm run generate:social-previews` generates preview


## Features to Add

For this blog setup, the highest-value additions are the ones that improve reading, discovery, and reuse.

A strong next batch would be:
- [x] Related posts at the bottom of each article, based on tags or series.
- [x] Previous/next post navigation so readers keep moving.
- [x] Copy-to-clipboard buttons for code and math blocks.
- [x] share button and lightweight reactions
- [x] Auto-generated social preview images per post.
- [ ] “Last updated” emphasis for older technical content.
- [ ] Search across blog posts, tags, and maybe projects.
- [ ] Reading progress bar for long technical posts.
- [ ] Newsletter or RSS subscribe callout after the article.
- [ ] Commenting.
- [ ] Series support for multi-part topics like computer vision or deep learning.
- [ ] Bookmarkable footnotes or heading copy links for easier sharing.

## Search

I’d add it in two places, with one being the primary entry point.

The best primary placement is the top nav as a search trigger or compact input. Search is a cross-site action, not just a blog action, so putting it in the global navigation makes it feel available everywhere and matches the fact that you want to search posts, tags, and projects together.

The best secondary placement is the top of the blog index page. That gives people a more obvious search surface when they’re already in “browse content” mode, and it can double as a filterable discovery page.

My recommendation:
1. Add a small search button or input in the navbar.
2. Open a dedicated search page or search overlay from there.
3. Also place the same search input at the top of `/blog/` for discoverability.

I would not make the main article page itself carry a large search bar. On individual posts, that usually competes with the reading experience.

For the behavior, I’d structure it like this:
- Search input matches blog titles, descriptions, tags, and optionally excerpt/body text.
- Projects are included in the same results list, labeled clearly as `Post`, `Tag`, or `Project`.
- Tags should be searchable both as direct tag results and as boosted matches on posts.
- Results should update instantly on the client for speed.
- Clicking a tag result should go to `/tags/[tag]/`.
- Clicking a post or project result should go directly to that page.

For implementation shape, I’d probably do:
- A generated search index from existing content collections.
- One shared search component used in both navbar-triggered search and the blog page.
- A dedicated `/search` page or modal-like overlay.
- Lightweight client-side filtering first, since your content size looks manageable.

If we want the cleanest UX, I’d choose this:
- Navbar: magnifying-glass trigger.
- Opens: full search overlay or `/search`.
- Blog index: visible search bar near the title.
- Search scope: posts, tags, projects.

A couple of product choices we should settle before building:
- Do you want search as an overlay/modal, or as a dedicated `/search` page?
- Should results search full article body text, or just title/description/tags for now?

My recommendation is `/search` page first, with a navbar trigger and a second input on `/blog/`, because it’s simpler, more shareable, and easier to maintain than a modal.

### Implementing Search

For this site, I would not use FAISS.

FAISS is great when you have:
- very large datasets
- vector embeddings
- a backend/service to query against
- semantic search as a real requirement

For a personal site with blog posts, tags, and projects, FAISS is probably too heavy and awkward, especially if this is a static Astro deploy. You’d be adding vector generation, index storage, and likely a server-side search layer just to solve a problem that a lightweight lexical index handles well.

I’d split the problem into two possible search styles.

**Best first version: lexical search**
This is the practical choice.

How it would work:
1. During build, collect all searchable documents:
   - blog posts
   - projects
   - tags
2. For each item, store fields like:
   - `type`
   - `title`
   - `description`
   - `tags`
   - `url`
   - maybe `body` or excerpt
3. Build a client-search index from that data.
4. Load the index on the `/search` page or in a search overlay.
5. Query it in the browser as the user types.
6. Rank results with boosts:
   - title highest
   - tags next
   - description next
   - body text lowest

Libraries that fit well:
- `minisearch`
- `flexsearch`
- `fuse.js`

My recommendation: `minisearch`.
It gives you real indexing and field boosts without being too complex.

A good ranking model would be:
- exact title match > partial title match
- tag match boosted strongly
- project titles boosted similarly to blog titles
- body matches allowed but weaker
- maybe recent posts get a small bonus

**If you want semantic search later**
Then you’d move toward embeddings, not directly “FAISS first.”

That flow would be:
1. Chunk blog content into searchable sections.
2. Generate embeddings at build time or ahead of time.
3. Store vectors somewhere queryable.
4. At search time:
   - embed the query
   - do nearest-neighbor retrieval
   - return best chunks/pages

That can work, but for a static personal site it usually means one of these:
- a serverless endpoint
- an external vector DB
- shipping a simplified precomputed vector structure to the client

That’s much more moving parts.

**What I’d actually build**
I’d use a hybrid but start simple:

Build-time:
- Generate a `search-data.json`
- Include:
  - blog title
  - blog description
  - tags
  - plain-text body excerpt or full body
  - project title/description
  - tag records as standalone results

Client-side:
- Use `MiniSearch`
- Index fields:
  - `title`
  - `description`
  - `tags`
  - `content`
- Store fields:
  - `type`
  - `url`
  - `title`
  - `description`
  - `tags`

Query behavior:
- tokenize query
- prefix search enabled
- fuzzy matching mild, not too aggressive
- title/tag boosts
- maybe group results by `Posts`, `Projects`, `Tags`

**Why this is better than FAISS here**
- works on static hosting
- fast enough for your site size
- easier to debug
- easier to tune relevance
- no backend needed
- no embedding generation cost

If you want, I can sketch the exact architecture for Astro next:
- where to generate the index
- what shape the JSON should have
- how the search page/component should query and rank results

## Hero Image:

Yes, I see what you want now: just **two clean paste-ready templates with placeholders**, not instructions about output formatting.

Use these as-is.

**1. Extract Content Template**

```text
From this blog post, extract a compact image brief for a hero image.

Return:
- Title
- Short description
- H2/H3 headings
- Main theme
- One visual metaphor
- 6 to 10 visual keywords

Rules:
- Use the existing title
- Use the existing description if available, otherwise write a short 1 to 2 sentence summary
- Extract only meaningful H2 and H3 headings in order
- Ignore code blocks, imports, and implementation details
- Keep the theme short and specific
- Make the visual metaphor concrete and visually representable
- Make the visual keywords technical and image-friendly, not generic art words

Blog content:
{{BLOG_CONTENT}}
```

**2. Generate Image Template**

```text
Create a custom hero image for a technical blog post using this content:

Title: {{TITLE}}
Description: {{DESCRIPTION}}
Headings:
{{HEADINGS}}
Theme: {{THEME}}
Visual metaphor: {{VISUAL_METAPHOR}}
Visual keywords:
{{VISUAL_KEYWORDS}}

Style direction:
- futuristic
- cinematic
- premium
- slightly anime-inspired
- polished and intentional
- suitable for a serious software engineering blog

Color direction:
- Primary neon orange: #FF7A1A
- Amber highlight: #FFB347
- Hot magenta: #FF4FD8
- Neon pink: #FF73C6
- Electric violet accent: #8B5CFF
- Soft text / light glow: #E8ECFF
- deep navy: #090B14
- indigo: #111526
- near-black: #06080D
- charcoal: #1A1F2B

Important:
- the site branding is primarily green, so the image should still feel compatible with a green-led website
- primary site green references:
  brand green: #2AD017
  bright accent green: #52E840
  dark support green: #1A870E
  deepest green: #043102
- green does not need to be dominant
- if helpful, include only a subtle green or teal secondary glow using the brand green family above
- do not let green overpower the main palette in the color direction section
- prioritize the orange, amber, magenta, pink, violet, and dark base tones first, with green only as a supporting brand-consistency accent when appropriate

Composition and constraints:
- wide blog hero image
- strong focal point
- clean layered depth
- visually rich but not cluttered
- no text, labels, logos, or watermark
- no stock-photo look
- avoid generic person-at-laptop scenes unless strongly relevant
- prefer conceptual technical imagery built around the theme and visual metaphor
```
