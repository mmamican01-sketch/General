# GLOBAL RESPONSIVE PARITY PASS v1.0 — Summary

## Phase A — EXTRACT GLOBAL CONTRACTS ✅

**Files created:**
- `docs/MEDIA_RATIO_CONTRACT.md`
- `docs/CARD_HEIGHT_CONTRACT.md`
- `docs/GRID_CONTRACT.md`
- `docs/TYPOGRAPHY_CONTRACT.md`

## Phase B — APPLY CONTRACTS

### B1 ✅ MediaFrame.astro
- **File:** `src/components/MediaFrame.astro`
- Props: `ratio`, `class`, `imgClass`, `src`, `alt`, `bgClass`, `marginBottom`
- Output: `aspect-[16/9]` + `overflow-hidden` + `object-cover`

### B2 ✅ Replace media wrappers
- **Files changed:** index.astro, products.astro, products/[slug].astro, commodities/index.astro, commodities/sugar.astro, commodities/wheat.astro, commodities/barley.astro, commodities/sunflower-oil.astro
- All `aspect-[16/9]` + `overflow-hidden` blocks replaced with `<MediaFrame>`
- Commodities: `h-[320px]` / `h-[420px]` → `aspect-[16/9]` (per contract)

### B3 Card blocks
- Cards use MediaFrame (aspect ratio) — no min-height on media blocks
- Product Groups: no card wrapper (React has none)
- Commodities cards: aspect ratio applied

### B4 Grid parity
- See GRID_CONTRACT.md for exact cols/spans/gaps
- Astro uses responsive variants; React uses fixed. Align where needed.

### B5 Typography parity
- See TYPOGRAPHY_CONTRACT.md
- Match H1/H2/H3/body sizes to React

## Build Status
- `npm run build` — **PASS**

## Files Changed (Phase B)
- **New:** `src/components/MediaFrame.astro`
- **New:** `docs/MEDIA_RATIO_CONTRACT.md`, `CARD_HEIGHT_CONTRACT.md`, `GRID_CONTRACT.md`, `TYPOGRAPHY_CONTRACT.md`
- **Modified:** `src/pages/en/index.astro`, `products.astro`, `products/[slug].astro`
- **Modified:** `src/pages/en/commodities/index.astro`, `sugar.astro`, `wheat.astro`, `barley.astro`, `sunflower-oil.astro`
