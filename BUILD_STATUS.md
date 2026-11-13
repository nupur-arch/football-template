# Build status

## Done
- Step 1 foundation only: Next.js 15 App Router, TypeScript, Tailwind 3 and Yarn (`package.json`, `yarn.lock`).
- Reference-inspired Touchline identity, favicon and local pitch fallback (`src/components/logo.tsx`, `src/app/icon.svg`, `public/images/fallback.svg`).
- Light/dark colors, radii, shadows, easing and duration tokens (`src/app/globals.css`, `tailwind.config.ts`); DM Sans + Space Grotesk through `next/font`.
- Persisted system-default theme with pre-render theme script (`src/components/providers.tsx`).
- Sticky shrinking header, wide mega-menus, active underline, focus-trapped mobile drawer, theme toggle, footer (`src/components/header.tsx`, `footer.tsx`).
- Debounced grouped search, recent/trending searches, keyboard navigation and shortcut; server-rendered `/search` results (`src/components/search.tsx`, `src/app/search/page.tsx`).
- Normalized Article, Match, Team, Player, Standing, Banner, Category types (`src/types/index.ts`).
- Services for articles/article, banners, matches, standings, teams, players and search (`src/services/`); central endpoints and response mappers (`src/lib/api/`).
- Exactly 20 featured mock articles, plus teams, players, matches, standings and banner data (`src/mocks/index.ts`).
- Shared Button, Card, Skeleton, AdSlot, sanitized MarkdownContent, SafeImage and reduced-motion helpers (`src/components/`); animation features load separately.
- Minimal home proof only (`src/app/page.tsx`), shared loading/error/empty states, metadata, canonical, JSON-LD, sitemap and robots.
- Three-line working rules (`AGENTS.md`, `.clinerules`).
- Data-boundary verification passed: article count/unique slugs, lookup, grouped/empty search, cancellation, six real-mode endpoint mappings and HTTP error propagation (fetch stub; no external API claimed).

- Verification passed: `yarn lint`, `yarn build` (Next.js 15.5.29), and 10 production HTTP smoke checks: home, grouped/empty search, team/player listings, icon, fallback, robots, sitemap and 404.

## Step 2 — Home S1–S5
- S1: automatic four-phrase headline with synchronized geometric mosaic and pause control.
- S2: exactly 20 featured service articles, 3D deck, animated counter, progress and complete thumbnail rail; one selection state drives all three, with autoplay, hover/focus pause, explicit pause, arrow keys and drag/swipe. Live-match strip and next-kickoff countdown use normalized Match data.
- S3: grid-backed introduction and circular colored-shape illustration around the shared logo, using the shared reveal helper.
- S4: four latest article cards stack with sticky positioning, scroll-linked scaling and dimming; ordinary cards on mobile/reduced motion.
- S5: dark pinned fan section with a local blurred stadium illustration, opposing headlines, scroll-staggered question pills and an entry fade; unpinned on mobile/reduced motion.
- Reused services, normalized types, SafeImage, Button/ButtonLink, Card, Logo and reduced-motion/reveal helpers. Home copy lives in content/strings.ts; scroll enhancement is loaded separately. Foundation behavior and services remain unchanged.
- Targeted verification: `node scripts/verify-home.mjs` passes 50 component-logic/CSS/scroll checks, including every rail selection, wraparound, autoplay, hover/focus/pause, arrows, swipe, 320/375/767/768/1440px responsive rules, reduced-motion guards and preference-change cleanup.
- Production HTTP checks passed: 20 server-rendered slides, 20 thumbnails, one selection, one H1, 20 NewsArticle schemas, readable S1–S5 text, four latest cards, six fan pills, both local assets and a working story search destination.
- Final verification: `yarn lint` and `yarn build` passed. Browser host and native pipe remain unavailable; actual visual layout, native touch and browser motion playback are not claimed as verified.

## In progress
- None. Step 2 (Home S1–S5) is complete.

## Next
- Stop after Step 2. Await an explicit next-step instruction before building S6–S13 or inner pages.

## Decisions
- This is a local repository implementation; no hosting or publication.
- `NEXT_PUBLIC_USE_MOCK=true` is the default, including when unset. Set to `false` for the API.
- `NEXT_PUBLIC_API_BASE_URL` is required in real mode; `NEXT_PUBLIC_SITE_URL` defaults to `http://localhost:3000` (`.env.example`).
- API adapters accept arrays or `{ data: [] }`; configure resource paths in `src/lib/api/client.ts` and upstream field shapes in `src/lib/api/mappers.ts`.
- Search composes normalized news, team and player services. Article lookup composes the article collection until an upstream detail contract is known.
- Real-mode images currently accept local paths; unapproved remote/missing/broken images use the branded fallback. Remote image support can be added in the mapper under a defined image contract.
- Mock scores, dates and stats are illustrative fixture data, not a live feed. All assets are local; no placeholder image services.
- Site identity/navigation/palette settings are in `src/content/site.config.ts`; shared English copy is in `src/content/strings.ts`.
- Search results expose expandable article markdown as a foundation preview; dedicated article/team/player pages remain deferred.
- Public environment variables are embedded at build time; rebuild after changing API mode, base URL or site URL.
- Browser visual verification is unavailable: browser host/native pipe are not connected. Use production build and HTTP checks; no visual QA is claimed.
