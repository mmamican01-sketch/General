# RESPONSIVE_RISK_INVENTORY.md
# GLOBAL RESPONSIVE PARITY PASS v1.1 — Phase 0.3
# Generated: Full scan of Astro_Site/src

## A) Media Wrappers

### `<img>`
| File | Line | Notes |
|------|------|-------|
| MediaFrame.astro | 32 | Internal — outputs img with object-cover |
| Welcome.astro | 7, 11 | Background + logo — not page content |
| ar/who-we-are.astro | 38 | **RISK** — raw img inside h-[420px] figure, no MediaFrame |

### `<picture>`
| File | Line | Notes |
|------|------|-------|
| (none) | — | No picture elements found |

### `background-image` / `style="background`
| File | Line | Notes |
|------|------|-------|
| (none) | — | No inline background-image found |

### `aspect-[`
| File | Line | Notes |
|------|------|-------|
| MediaFrame.astro | 20-25 | aspect-[16/9], aspect-[4/3], aspect-square |
| (pages) | — | All EN media use MediaFrame (aspect ratio) |

### `h-[` (fixed heights)
| File | Line | Notes |
|------|------|-------|
| en/index.astro | 44 | h-[75vh] — Hero, matches React |
| ar/who-we-are.astro | 37 | **RISK** — h-[420px] figure, can cause square on narrow mobile |

### `min-h-[`
| File | Line | Notes |
|------|------|-------|
| BaseLayout.astro | 53 | min-h-screen on body — layout only |

### `object-cover`
| File | Line | Notes |
|------|------|-------|
| MediaFrame.astro | 28 | Via imageClass |
| ar/who-we-are.astro | 38 | Raw img |

### `overflow-hidden`
| File | Line | Notes |
|------|------|-------|
| en/index.astro | 44 | Hero section |
| MediaFrame.astro | 27 | Wrapper |
| ar/who-we-are.astro | 37 | Figure |

---

## B) Layout / Ratio Killers

### `h-screen`
| File | Line | Notes |
|------|------|-------|
| BaseLayout.astro | 53 | min-h-screen on body — layout, not media |

### `h-[75vh]`
| File | Line | Notes |
|------|------|-------|
| en/index.astro | 44 | Hero — **verify matches React** (React uses h-[75vh]) |

### `w-full h-full` without aspect wrapper
| File | Line | Notes |
|------|------|-------|
| MediaFrame.astro | 28 | img inside aspect wrapper — OK |
| ar/who-we-are.astro | 38 | img inside h-[420px] figure — **RISK** |

### `grid-cols-` differences (sm/md/lg)
| File | Line | Pattern |
|------|------|---------|
| en/index.astro | 71, 93, 118, 157 | grid-cols-1 md:grid-cols-12, grid-cols-2 md:grid-cols-5, grid-cols-2 md:grid-cols-12 gap-6 sm:gap-8 |
| en/products.astro | 36 | grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 |
| en/products/[slug].astro | 83, 107, 126 | grid-cols-1 md:grid-cols-12, gap-4 sm:gap-8 |
| en/commodities/* | 27, 33, 41 | grid-cols-1 md:grid-cols-2, gap-10 md:grid-cols-2 lg:grid-cols-4 |
| en/sustainability.astro | 28, 52, 70, 88, 157 | gap-6 sm:gap-8, gap-8 lg:gap-12 |
| en/careers.astro | 36, 55, 93, etc. | gap-4 sm:gap-8 |
| en/contact.astro | 30, 135 | gap-8 lg:gap-12, gap-6 sm:gap-8 |
| en/who-we-are.astro | 26, 47, 84, 187 | gap-8 lg:gap-12, gap-6 sm:gap-8 |
| Footer.astro | 13 | grid-cols-1 md:grid-cols-12 gap-8 |

---

## Summary: High-Risk Items

1. **ar/who-we-are.astro:37** — `h-[420px]` fixed height on figure. Replace with MediaFrame (scope: ALL includes AR).
2. **MediaFrame.astro** — Add `loading`, `decoding` props per Phase 2 spec.
3. **Grid gaps** — Some use `gap-6 sm:gap-8` vs React `gap-8` or `gap-12`; verify parity.
