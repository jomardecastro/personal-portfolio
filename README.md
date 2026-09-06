# portfolio-site

Source for **[jdecastro.dev](https://jdecastro.dev)** — my portfolio: a landing page,
two long-form case studies, and a set of live demos backed by a real API rather than
screenshots.

## Stack

**Web** — React 18, TypeScript, Vite, Tailwind, shadcn/ui, framer-motion, React Router
**API** — Express, Prisma, PostgreSQL, Resend (contact form)
**Serving** — nginx in a container, behind nginx on the host; Docker Compose
**Tests** — Vitest

## Structure

```
src/
  data/experience.ts     career history — single source of truth
  data/projects.tsx      project + case-study content
  data/systems.tsx       the systems showcase
  pages/work/            /work/:slug case studies (lazy-loaded)
  pages/systems/         /systems/:slug detail pages
  components/projects/   the interactive demos
scripts/
  build-resume.mjs       renders the résumé PDF from src/data/experience.ts
server/                  Express + Prisma API backing the demos and contact form
nginx.conf               config for the container that serves the built site
```

Two decisions worth calling out, since both exist to prevent a specific failure:

**The data modules are the single source of truth.** `experience.ts` feeds both the
site's Experience section and the résumé PDF generator, so the two cannot drift — which
is exactly how a published PDF ends up a year behind the site it links from. Same idea
for `projects.tsx`: the landing cards and the case-study pages read the same objects.

**The SPA fallback in `nginx.conf` deliberately omits the `$uri/` term.** `public/work/`
ships real directories of case-study images, so `try_files $uri $uri/ /index.html` matched
`/work/omni/` as a directory and returned `301 → 403` instead of handing the route to the
router. Both case studies were unreachable by direct link. Any route that shadows an asset
directory hits the same trap.

## Running locally

```sh
npm install
npm run dev        # vite dev server
npm test           # vitest
npm run build      # production build to dist/
```

The API is optional for front-end work — the demos degrade to their seed data without it.
To run the full stack:

```sh
cp .env.example .env    # set RESEND_API_KEY if you want the contact form to send
docker compose up -d
```

## Building the résumé

`scripts/build-resume.mjs` renders `public/resume.pdf` from `src/data/experience.ts` via
headless Chromium. Playwright is not a dependency here — the résumé is rebuilt a handful
of times a year, and several hundred MB of browsers in every install isn't a fair trade.
Point it at any local Playwright instead:

```sh
PLAYWRIGHT_MODULE=/path/to/node_modules/playwright/index.mjs \
CHROMIUM_PATH=/path/to/chrome \
node scripts/build-resume.mjs
```

With neither variable set it falls back to a plain `playwright` install and its bundled
browser. It also drops `scripts/.resume-preview.html` so you can iterate on layout in a
browser instead of regenerating PDFs.

## Deploying

The site builds inside its image, so a deploy is a pull and a rebuild:

```sh
git pull
docker compose build web
docker compose up -d web
```

Host nginx terminates TLS and reverse-proxies to the container. Compression and cache
headers are set in the container's `nginx.conf` so they travel with the deploy rather
than living in a hand-edited file on a server.

---

No license — personal site, all rights reserved. Read it, borrow ideas, don't ship it as
your own.
