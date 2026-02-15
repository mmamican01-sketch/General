# Header & Navigation Mapping Document

> **Scope:** Analysis + Mapping plan ONLY. No code translation yet.  
> **Sources:** Figma design (read-only) + current Astro header.  
> **Output:** Single mapping document for future implementation.

---

## Section 1: Figma Header Breakdown

### Tier A — Utility Bar

| Property | Value |
|----------|-------|
| **Container** | `w-full bg-[#f5f5f5]` |
| **Inner wrapper** | `max-w-[1400px] mx-auto px-8 py-3` |
| **Layout** | `flex justify-end items-center gap-8` |
| **Purpose** | Utility links, global sites trigger, search button |

**Elements (left-to-right in DOM, visually right-aligned):**

1. **Apply for a role**  
   - Element: `<a href="#">`  
   - Classes: `flex items-center gap-1 text-sm text-[#2c2c2c] hover:text-[#000] transition-colors`  
   - Icon: `ExternalLink` (lucide-react) — `w-3.5 h-3.5`

2. **Newsroom**  
   - Element: `<a href="#">`  
   - Classes: `text-sm text-[#2c2c2c] hover:text-[#000] transition-colors`

3. **Contact Us**  
   - Element: `<Link to="/contact">`  
   - Classes: `text-sm text-[#2c2c2c] hover:text-[#000] transition-colors`

4. **Global sites**  
   - Element: `<button>` (dropdown trigger)  
   - Classes: `flex items-center gap-1 text-sm text-[#2c2c2c] hover:text-[#000] transition-colors`  
   - Icon: `ChevronDown` (lucide-react) — `w-3.5 h-3.5`

5. **Search**  
   - Element: `<button>`  
   - Classes: `bg-[#2c2c2c] p-2 hover:bg-[#000] transition-colors`  
   - Icon: `Search` (lucide-react) — `w-4 h-4 text-white`  
   - Accessibility: `aria-label="Search"` ✓

---

### Tier B — Primary Header

| Property | Value |
|----------|-------|
| **Container** | `w-full bg-white border-b border-gray-200` |
| **Inner wrapper** | `max-w-[1400px] mx-auto px-8 py-6` |
| **Layout** | `flex items-center justify-between` |
| **Purpose** | Logo, primary navigation |

**Elements:**

1. **Logo block**  
   - Element: `<Link to="/">`  
   - Classes: `flex items-center gap-3`  
   - Children:
     - Hexagon shape: `w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 clip-polygon`  
     - Text: `text-2xl tracking-tight` — font `Inter, sans-serif` — content `AFGT`

2. **clip-polygon (from index.css)**  
   - Utility: `.clip-polygon`  
   - CSS: `clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);`  
   - Purpose: Hexagon silhouette for logo

3. **Primary Navigation**  
   - Element: `<nav>`  
   - Classes: `flex items-center gap-12`  
   - Font: `Cormorant Garamond, serif` (inline style)  
   - Items (each): `text-[#2c2c2c] hover:text-[#000] transition-colors`  
   - Links:
     - Who we are → `/who-we-are`
     - Products & Services → `/products`
     - Sustainability → `/sustainability`
     - Careers → `/careers`

---

### Fonts (fonts.css)

- **Inter:** `Inter, sans-serif` — used for logo text (AFGT), utility bar text  
- **Cormorant Garamond:** `Cormorant Garamond, serif` — used for primary nav items  
- Source: Google Fonts — `family=Cormorant+Garamond:wght@400;500&family=Inter:wght@400;500`

---

### Icons Used

| Icon | Source | Where | Size |
|------|--------|-------|------|
| ExternalLink | lucide-react | Utility bar — Apply for a role | w-3.5 h-3.5 |
| ChevronDown | lucide-react | Utility bar — Global sites | w-3.5 h-3.5 |
| Search | lucide-react | Utility bar — Search button | w-4 h-4 |

---

### Figma Accessibility — Present vs Missing

**Present:**
- Search button: `aria-label="Search"` ✓

**Missing:**
- No `aria-label` on main `<header>`
- No `aria-label` on primary `<nav>`
- No `aria-current="page"` on active nav links
- Global sites button: no `aria-expanded`, `aria-haspopup`, `aria-controls`
- Apply for a role link: no `aria-label` for external-link semantics
- No skip-link

---

## Section 2: Astro Current Header Setup

### Layout Integration

- **BaseLayout.astro** passes to Header:
  - `locale` (e.g. `"en"` | `"ar"`)
  - `currentPath` (e.g. `"about"`, `"commodities/wheat"`, `""`)

### Routing & i18n

- **Base paths:** `/en` and `/ar`
- **Link building:** `base = locale === "ar" ? "/ar" : "/en"`  
  - Page links: `${base}/${item.href}` (e.g. `/en/about`, `/ar/contact`)
- **Locale switcher:** `switchHref = /${otherLocale}/${currentPath}` — preserves path when switching locale
- **Canonical / hreflang:** Built in BaseLayout from `baseUrl`, `enPath`, `arPath`

### Current Header Structure

- Single-tier header (no utility bar)
- `max-w-6xl` (not 1400px)
- `px-4 py-4`
- Nav items: Home, About, Comodities, Contact (from `navItems` array)
- Inline locale switcher (AR/EN button)
- `aria-label="Main"` on nav ✓

### Nav Data (Current)

```js
const navItems = [
  { href: "", labelEn: "Home", labelAr: "الرئيسية" },
  { href: "about", labelEn: "About", labelAr: "من نحن" },
  { href: "commodities", labelEn: "Commodities", labelAr: "السلع" },
  { href: "contact", labelEn: "Contact", labelAr: "اتصل بنا" },
];
```

---

## Section 3: Component Mapping Plan

| Figma Component / Block | Astro Component Path | Notes |
|-------------------------|----------------------|-------|
| Header (root) | `src/components/Header.astro` | Replace existing; two-tier structure |
| Tier A (Utility Bar) | `src/components/Header.astro` (inline or `UtilityBar.astro`) | Can stay inline in Header.astro |
| Tier B (Primary Header) | `src/components/Header.astro` | Logo + nav in same component |
| Logo block | Inline in Header.astro or `src/components/Logo.astro` | Hexagon + AFGT text |
| Primary nav items | Inline in Header.astro | Nav built from data |
| Global sites dropdown | Inline in Header.astro via `<details><summary>` | No separate component initially |
| Icons | SVG snippets in Header or `src/components/icons/` | ExternalLink, ChevronDown, Search — no lucide dependency |
| clip-polygon | Add to `src/styles/global.css` (or shared utility) | Copy from Figma index.css |

**No React/Vite/TSX:** All icons and UI are Astro + HTML + CSS only.

---

## Section 4: Data Plan

### Utility Bar Links (static for now)

```ts
// Static; later dashboard-driven
const utilityLinks = [
  { href: "/careers/apply", labelEn: "Apply for a role", labelAr: "...", external: true },
  { href: "/newsroom", labelEn: "Newsroom", labelAr: "..." },
  { href: "contact", labelEn: "Contact Us", labelAr: "اتصل بنا" },
];
```

### Primary Nav (static for now; align with Figma routes)

```ts
const primaryNavItems = [
  { href: "who-we-are", labelEn: "Who we are", labelAr: "من نحن" },
  { href: "products", labelEn: "Products & Services", labelAr: "المنتجات والخدمات" },
  { href: "sustainability", labelEn: "Sustainability", labelAr: "الاستدامة" },
  { href: "careers", labelEn: "Careers", labelAr: "الوظائف" },
];
```

### Mega Menu (future; placeholder structure)

```ts
// For Products & Services etc. — static structure now, CMS later
interface MegaMenuSection {
  title: string;
  links: { href: string; label: string }[];
}
// Not implemented in Figma; plan for future
```

### Global Sites Dropdown (static for now)

```ts
const globalSites = [
  { label: "Saudi Arabia", href: "https://..." },
  { label: "UAE", href: "https://..." },
  // ...
];
```

---

## Section 5: Accessibility + SEO Requirements

### Header / Nav Specific

| Requirement | Implementation |
|-------------|----------------|
| Main nav | `aria-label="Main navigation"` or equivalent |
| Active page | `aria-current="page"` on current nav link |
| Search button | `aria-label="Search"` (already in Figma) |
| Global sites dropdown | `aria-haspopup="true"`, `aria-expanded` bound to open state |
| External links | `rel="noopener noreferrer"` + optional `aria-label` for “opens in new tab” |
| Skip link | Add “Skip to main content” as first focusable element (above header) |
| Focus order | Logical tab order: skip link → utility bar → logo → nav → dropdowns |
| Keyboard | Dropdown operable via Enter/Space; Escape closes |
| RTL | Respect `dir` from layout; mirror layouts for `/ar` |

### details/summary Dropdown

- Use native `<details>` + `<summary>` for Global sites
- No `role="button"` on summary (native semantics)
- Ensure `aria-expanded` matches state if enhanced with JS later

---

## Section 6: Locked Decisions

1. **Container width:** Use Figma `max-w-[1400px]` for header (not current `max-w-6xl`).
2. **Dropdown:** Global sites implemented via native `<details><summary>` — functional without JS.
3. **Runtime:** Astro only. No React, no Vite runtime, no .tsx imports.
4. **Design source:** `/Figma_Make_Export` is read-only reference; no copying of package.json or React code.
5. **i18n:** Keep `locale` + `currentPath` props; links remain `/{locale}/{path}`.
6. **Fonts:** Inter + Cormorant Garamond per Figma fonts.css.
7. **Logo:** Hexagon via `.clip-polygon` + gradient; text “AFGT” in Inter.

---

*Document created for Header & Navigation analysis. No code changes applied.*
