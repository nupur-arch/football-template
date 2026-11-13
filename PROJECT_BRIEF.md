# PROJECT BRIEF: Premium Football News Template

Goal: a premium, interactive, animated, user-friendly football news website template. A visitor should want to scroll it twice. Mock data now, real API later (swap must be easy).
Design reference: the 2 attached Inkbyte screenshots (big rounded corners, arrow-button cards, clean type, airy spacing). Motion reference: loopsii.com (scroll-linked storytelling, layered cards, colored tiles). Adapt everything to football; do not copy its content or branding.

## Stack
Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion, next-themes, lucide-react, react-markdown + remark-gfm + rehype-sanitize, next/image, next/font. Package manager: yarn. `yarn lint` and `yarn build` must pass after every step.

## Look
- Palette (CSS variable tokens, light + dark): deep pitch-green, electric lime accent, warm white (light); near-black green (dark). Pastel panel colors for tiles (blue, coral, lime, pale green).
- One expressive bold display font + one clean readable body font (next/font). Large headings, body 16px+, good contrast.
- Large rounded corners, soft shadows, fine square-grid background on some sections.
- No preloader. No custom cursor. No pricing section.

## Motion rules
- Tokens: ease `cubic-bezier(0.22, 1, 0.36, 1)`; entrances 0.5-0.8s; stagger 60-90ms; toggles 0.25s; accordion 0.3s.
- Animate only transform/opacity. Scroll-linked effects use sticky + useScroll/useTransform, not independent timers.
- Mobile: simplified versions. Respect prefers-reduced-motion (no pinning, fades only). Page text must be readable without JS.

## Data layer (important)
UI uses only normalized types: Article, Match, Team, Player, Standing, Banner, Category.
- `services/*` (getArticles, getArticle, getBanners, getMatches, getStandings, getTeams, getPlayers, search) call `lib/api/client.ts`.
- `NEXT_PUBLIC_USE_MOCK=true` returns data from `mocks/` (realistic football data, exactly 20 featured articles, local images or gradients, never external placeholder services).
- When false: fetch `NEXT_PUBLIC_API_BASE_URL` and pass every response through a mapper (`mapApiArticle`, etc.). Replacing mock with the real API must mean editing only mappers and endpoints.
- Site name, locale, nav, colors and UI strings live in `content/site.config.ts` and `content/strings.ts` (default English).

## Global rules
- Markdown content fields: render links as real clickable links (sanitized; external links `rel="noopener noreferrer"`), plus bold, lists, images.
- One local branded fallback image everywhere (missing or broken image), same aspect ratio as real images.
- Titles use CSS line-clamp, never cut by code. No raw URLs as text.
- Every interactive element: hover, active, focus-visible, disabled. Loading (skeleton), empty and error states on every data view.
- Responsive 320-1440px, no horizontal scroll. Accessible (keyboard, aria, contrast).
- Performance: next/image with sizes, `priority` only above the fold, lazy-load heavy animation code.
- Ad slots: fixed reserved height, clean empty state.
- SEO basics: generateMetadata, canonical, one H1 per page, JSON-LD NewsArticle + BreadcrumbList, sitemap.ts, robots.ts.

## Header and search
Sticky header with blur that shrinks on scroll, expensive-looking logo (SVG monogram + wordmark, subtle load/hover animation), mega-menu dropdowns, animated active-link underline (layoutId), mobile drawer, dark/light toggle (no flash, persisted, system default).
Search: dropdown with live debounced suggestions grouped (news, teams, players), recent + trending, keyboard (arrows, Enter, Esc, Cmd/Ctrl+K), loading/empty states, plus a /search page.

## Home sections (order)
- S1 Hero: headline with rotating phrases ("One place for live scores / standings / transfers / fixtures"), smooth swap 0.5-0.9s, auto. Below it a colorful geometric mosaic (squares, circles, diamonds, pitch-line shapes) that rearranges with each phrase.
- S2 Top Stories banner: exactly 20 news. 3D card-deck carousel (active card large, next cards peek behind with depth/parallax), animated 01 / 20 counter, per-slide progress, thumbnail rail of all 20, autoplay (pause on hover/focus), drag/swipe, arrow keys. Counter, rail and slide always in sync. Under it: live matches strip + next-match countdown.
- S3 Intro: small label + paragraph, fine grid background, circular illustration of colored shapes around the logo mark (fade + slight upward move).
- S4 Latest news: stacking cards scroll effect. First card pins, next slides up over it, previous scales down and dims.
- S5 Dark pinned section: background blurred stadium/player image, two headlines left and right, white pill-shaped fan questions ("Who scored?", "When is kickoff?", "Where is the table?" ...) appear staggered around the center. Light-to-dark transition on entry.
- S6 Match-center showcase: dark-to-light transition, layered pastel panels (live score, standings, stats) as stacked-paper cards entering with slide + scale, content revealing inside.
- S7 "Everything in one place": white cards in a grid (league tabs, standings preview, top scorers/assists) plus large stat numbers (count-up is our choice, it was not confirmed in the reference). Central connection diagram: black pill, lime ring, headlines left and right. Wide lime CTA panel.
- S8 Feature showcase: sticky text on the left changes with scroll progress while layered cards on the right change in sync. 5 items: Live scores, Table, Players, Transfers, News. Layers with controlled z-index, pastel borders, offset positions.
- S9 Tile grid: large colored tiles (leagues, competitions, categories) with staggered entrance and small decorative black illustrations; groups slide up as the previous group leaves.
- S10 Fan voices: testimonial-style carousel (card with avatar, name, quote), prev/next arrows, slide indicator, 0.4-0.7s transition.
- S11 Matchday path: numbered cards 01-04 (Preview, Live, Report, Analysis) along a curved dotted path, scroll-linked, slight rotation, active card centered with neighbors partly visible.
- S12 Newsletter: white CTA panel + colored stats panel side by side; FAQ accordion (plus turns into minus, 0.3s). A snappy toggle component (e.g. standings Overall / Home / Away) updates the data, not just the switch.
- S13 Closing: oversized editorial words at different vertical levels moving with scroll, pixel-pattern background, final CTA card with newsletter form; footer links.

## Inner pages (later step)
News list (filters, pagination), article (markdown, share, related, breadcrumbs, reading progress), match center (live / fixtures / results), standings, teams + team page, players + player page, about/contact/legal, branded 404 and error.

## Working agreement (for any AI)
Read this file and BUILD_STATUS.md first. Do only the step you are given. Open only the files you need, don't scan the whole repo. After each step: update BUILD_STATUS.md (Done / In progress / Next / Decisions with file paths and env flags), run `yarn lint` and `yarn build`, commit with a clear message, stop and report in at most 10 lines. If you stop midway, BUILD_STATUS.md must say exactly where.
