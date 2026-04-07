# Welcome to Quantum!

1. To get started, first install all necessary packages with `npm install`, then run an initial build to make sure the setup works `npm run build`.
2. Now you can setup the site to your liking!
   - [Style customization](https://cosmicthemes.com/docs/styles/)
   - [Content editing](https://cosmicthemes.com/docs/data/)
   - [Animations](https://cosmicthemes.com/docs/animations/)
   - [Keystatic CMS](https://cosmicthemes.com/docs/keystatic/) - if you don't want Keystatic you can run `npm run remove-keystatic`
   - [Forms](https://cosmicthemes.com/docs/contact-form/)

Should you need any assistance, send me a message at support@cosmicthemes.com

## Code Intro

I have created a few code tours to introduce you to the codebase. You will need the extension [Code Tour](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.codetour) to view them in VSCode.

The source files have the following setup. Note that not all files are included - it is already long, no one wants it to be longer.

```
.
├── .tours/
│   └── code-intro.tour
├── .vscode/
│   └── extensions.json
├── public/
│   ├── favicons/
│   │   └── favicon.ico
│   ├── images/
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── hero.jpg
│   ├── components/
│   │   ├── Hero/
│   │   │   ├── HeroSideImage.astro
│   │   │   └── HeroTinyImage.astro
│   │   └── Footer/
│   │       └── Footer.astro
│   ├── config/
│   │   ├── siteData.json.ts
│   │   └── navData.json.ts
│   ├── data/
│   │   ├── authors/
│   │   ├── blog/
│   │   ├── otherPages/
│   │   └── config.ts
│   ├── js/
│   │   └── blogUtils.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── blog/
│   │   │   ├── [...slug].astro
│   │   │   └── index.astro
│   │   ├── tags/
│   │   │   ├── [tag].astro
│   │   │   └── index.astro
│   │   ├── [page].astro
│   │   ├── 404.astro
│   │   ├── contact.astro
│   │   ├── index.astro
│   │   └── rss.xml.ts
│   └── styles/
│       └── global.scss
├── .gitignore
├── .prettierrc.mjs
├── astro.config.mjs
├── netlify.toml
├── package.json
├── package-lock.json
├── README.md
├── tailwind.config.cjs
└── tsconfig.json
```

For robots like Google to see the correct sitemap, you will want to edit the `public/robots.txt` file to use your website domain.

## Other Resources

- See my blog post on [recommended Astro web development setup](https://cosmicthemes.com/blog/astro-web-development-setup/).
- You can learn more information from the [theme docs](https://cosmicthemes.com/docs/) page on the [Cosmic Themes Website](https://cosmicthemes.com/).
- For support, see the [support page](https://cosmicthemes.com/support/).
- [License details](https://cosmicthemes.com/license/)

## General Astro Info

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory. I also frequently use `src/assets` for images when using Astro asssets for image optimization.

### 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

### 👀 Want to learn more?

Feel free to check out the [Astro documentation](https://docs.astro.build).

### Social Preview Generation

`npm run generate:social-previews` generates preview


### Features to Add

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

### Search

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

