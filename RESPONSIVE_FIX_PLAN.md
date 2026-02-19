# Responsive Optimization — Fix Plan

**Target breakpoints:** 375 (mobile), 768 (tablet), 1440 (desktop)

## PHASE 1 — Diagnosed Issues

| File | Problematic Patterns | Fixes |
|------|---------------------|-------|
| **Header.astro** | `px-8` fixed; nav `flex gap-12` with 4 links overflows at 375px; no mobile menu | Responsive `px-4 sm:px-6 lg:px-8`; hide nav on mobile, add hamburger + slide-out; utility bar: hide/wrap items on mobile |
| **Footer.astro** | `px-8 py-16`; `grid-cols-12` with `col-span-3/2` — no collapse on mobile | `px-4 sm:px-6 lg:px-8`; `py-12 lg:py-16`; `col-span-12 md:col-span-*` |
| **index.astro** | `h-[75vh]` fixed; `px-8`; `text-7xl` too large; `grid-cols-12` `col-span-6/5/3`; `padding: 64–96px` | `min-h-[50vh] sm:min-h-[60vh] lg:min-h-[75vh]`; responsive px/typography; `col-span-12 md:col-span-*`; `py-12 sm:py-16 lg:py-24` |
| **who-we-are.astro** | `px-8`; `py-72px`; `grid-cols-12` `col-span-6/4/3`; `text-6xl/4xl/3xl` | Same responsive px/py/typography; `col-span-12 md:col-span-*` |
| **products.astro** | Same; `grid-cols-12` for product rows `col-span-6/5` | Same; image-first on mobile for alternating layout |
| **products/[slug].astro** | Same; `col-span-6/5/4/8` | Same responsive patterns |
| **sustainability.astro** | Same; `grid-cols-12` `col-span-6` throughout | Same |
| **careers.astro** | Same; roles grid `col-span-5/3/2/2`; process `col-span-1/11` | Roles: stack on mobile; process: `col-span-12` |
| **contact.astro** | `px-8`; `py-24/py-20`; `col-span-4` | Same responsive patterns |

## Shared Patterns to Apply

- **Padding:** `px-4 sm:px-6 lg:px-8` and `py-12 sm:py-16 lg:py-24` (or `py-16 lg:py-24` for sections)
- **Typography:** `text-3xl sm:text-4xl lg:text-6xl` for h1; `text-2xl sm:text-3xl lg:text-4xl` for h2
- **Grid:** `grid-cols-1 md:grid-cols-12`; children `col-span-12 md:col-span-*`
- **Hero heights:** `min-h-[50vh] sm:min-h-[60vh] lg:min-h-[75vh]` (avoid fixed vh on small screens)
- **Images:** Keep `aspect-[16/9]` + `object-cover`

## PHASE 3 — Screenshot Capture

**Script:** `scripts/capture-screenshots.mjs`

**Usage:**
```bash
npm run build
npx puppeteer browsers install chrome   # if not installed
npm run capture:screenshots
```

**Output:** `parity-screenshots/responsive/{375|768|1440}/{page}.png`

**Pages captured:** `/en/`, `/en/who-we-are`, `/en/products`, `/en/products/sugar`, `/en/sustainability`, `/en/careers`, `/en/contact`
