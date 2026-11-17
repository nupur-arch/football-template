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

## Step 3 — Home S6–S13
- Audit of WIP commit `6104b8f`: S6, S7, S8, S10, S11, S12 and S13 were already complete; only S9 was partial.
- S9 completed in `src/components/home/home-more.tsx` and `src/app/home-more.css`: leagues / competitions / categories now render as grouped tile stages with desktop slide-up group transitions, tab-style group controls, and readable stacked mobile/reduced-motion fallbacks.

## In progress
- None.

## Next
- Stop after this step. Await an explicit next-step instruction before changing other areas.

## Closing
- `ALL GAME.` / `ALL HEART.` / `ALL HERE.` (`src/components/home/closing-scene.tsx`) move with `useScroll` and `useTransform`. Lines 1 and 3 come from the left, line 2 from the right, and all three settle on the staggered layout when the section is centered. Each line zooms from 0.38 up to 1.36, then back to 1, anchored on its own side so the swell stays in the viewport.
- The `See you at the touchline.` card rises a short distance and fades in. The pixel pattern sits on its own layer and shifts with a transform only.
- Type uses `clamp(1.75rem, 9vw, 7rem)` so the lines stay inside the viewport. `prefers-reduced-motion` keeps the settled layout with no movement. On a narrow screen the closing email field and button stack full width and stay tappable.

## Matchday path
- `Make a day of it.` (`src/components/home/matchday-path.tsx`, `src/app/home-more.css`) is one sticky stage, `calc(100svh - var(--header-h))` at `top: var(--header-h)`. The heading stays in its own area. The card track is clipped below it, so a card cannot cover the heading while scrolling up or down.
- Card shift, rotation and opacity come from `useScroll` and `useTransform` only. The pin is `calc(100svh + 80vh * 3)`. The dotted curve stays behind the cards, and the active card is centered. Below 768px the four cards stack in normal flow.

## Feature showcase
- `Stay a step closer.` (`src/app/home-more.css`) sticks in a stage of `calc(100svh - var(--header-h))` at `top: var(--header-h)`. `--header-h` is `5rem` in `src/app/globals.css`. The left copy and the pastel card stack are centered in that stage, and the stack height is clamped so every row stays inside the card.
- The pin is `calc(100svh + 80vh * 5)`, about 80vh of scroll per item. `01 / 05` through `05 / 05` still follow that progress. Below 768px the cards stack in normal flow.
- `.home-more` no longer uses `overflow: clip`, which was the ancestor breaking this sticky. The matchday track clips its own horizontal overflow.

## Story cylinder
- Replaced the rotating hero and the top-stories deck with one pinned gallery (`src/components/home/story-gallery.tsx`). `getBanners()` now returns the 20 featured stories (`src/mocks/index.ts`).
- The stage is `calc(100svh - var(--header-h))`, pinned 1100vh on desktop and 900vh on mobile so one wheel notch moves about a third of a card. Scroll progress 0–1 turns the cylinder through all 20 cards; `SCROLL_DIRECTION` is `-1` so scrolling down moves the track left to right. The wheel is pulled back by its radius so perspective 1200 and radius 1100 keep the center card at its real size.
- Reduced motion and no-JS keep a native horizontal row. The first three images are priority. All 20 links are in the server HTML. Lenis is unchanged.
- Browser check at 1440×700, 1440×900, 390×700 and 390×900: the counter tracks the centered card, five cards show on desktop and three on mobile, the title and button stay inside the stage, and the match strip follows when the pin ends.
- The stage does not clip the 3D wheel. While the page is moving, the wheel tracks that scroll directly. After it has been still, it eases onto the nearest card and ignores the tiny leftover scroll updates, so the card does not rock. Hover lifts on its own ease.

## Smooth scroll and S5 rebuild
- Dead zone: the old pin was 220vh while the pill stagger and darkness finished early, and `useScroll` offset `start end` / `end end` included a long approach where the stage was stuck and nothing moved. The pin is now the whole animation: progress 0–1 maps to `start start` / `end end`, so a wheel flick always moves something.
- `lenis` 1.3.27 in root mode (`src/components/smooth-scroll.tsx`), lerp 0.1, native touch, anchors on, disabled when `prefers-reduced-motion` is set. Route changes scroll to the hash or the top. `html.lenis` rules are in `src/app/globals.css`. `data-lenis-prevent` is on the search dropdown, mega-menu, dialog/drawer, story rail and table scroller. The header calls `stop()` / `start()` while the drawer or search overlay is open. No scroll-snap.
- S5 (`src/components/home/fan-scene.tsx`) is one sticky stage, `calc(100svh - var(--header-h))`, pinned 220vh on desktop and 160vh on mobile. Scroll progress drives the stadium fade, per-letter headlines, curved pill flight, 3D answer flip, closing line and button. Copy and positions live in `fanExchanges`. Mobile shows 4 pills and no pointer parallax. Reduced motion and no-JS show the answer chips unpinned. Opacity stays on the JS scroll value so it tracks Lenis; the scroll-timeline path was leaving fades stuck.
- Browser check at 1440×700, 1440×900, 390×700 and 390×900: headlines sit below the header, chips do not overlap or leave the stage, every progress band changes a visible property, and the other home sections still scroll.

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
- Earlier steps had no browser host. The Lenis and S5 rebuild step was checked in the browser at 1440×700, 1440×900, 390×700 and 390×900.
- StoryDeck autoplay/live-region state in `src/components/home/home-interactive.tsx` must stay SSR-stable on the first render; motion-dependent running state now activates only after mount to avoid hydration mismatches.
