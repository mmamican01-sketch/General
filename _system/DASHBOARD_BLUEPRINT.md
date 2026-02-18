# Dashboard Blueprint

Blueprint for a CMS-like internal dashboard that binds to this Astro codebase without changing route semantics.

## Entities

- **Site**
  - id, name, defaultLocale, supportedLocales, seoDefaults
- **Locale**
  - code (`en`, `ar`), direction (`ltr`/`rtl`), enabled
- **Page**
  - route, locale, title, description, status, sectionRefs
- **Section**
  - pageRoute, key, order, fieldRefs
- **Field**
  - key, type (`text|link|image|richtext`), value, selectorHint
- **MediaAsset**
  - path, mimeType, sizeBytes, alt, tags, usageRefs
- **Product**
  - slug, name, heroImage, description, overview, specifications[], origins[], certifications[]
- **Role**
  - title, location, department
- **Commodity**
  - slug, title, description, hero/section/cta content fields

## CRUD Screens Required

- **Site Settings**
  - Edit: site metadata, default locale, SEO defaults.
- **Locales**
  - List/Create/Edit/Disable locales (`en`, `ar`).
- **Pages**
  - List by locale, edit page-level title/description.
- **Content Slots Editor**
  - Route picker -> slot list from `CONTENT_SLOTS.json`.
  - Inline field editor by slot type (text/link/image).
- **Media Library**
  - Upload/browse/search assets, with usage graph.
- **Products**
  - Full CRUD for listing + detail fields.
- **Roles**
  - Full CRUD for careers role cards.
- **Commodities**
  - CRUD commodity meta and slot-backed content payloads.
- **Publishing Preview**
  - Validate data files + show generated route impact before build.

## Binding Rules (Dashboard -> Build-Time)

- Page-level SEO fields (`title`, `description`) map to `BaseLayout` props per route.
- Slot values are keyed by route + `data-slot` and must match selectors from `CONTENT_SLOTS.json`.
- `Field.type` is enforced:
  - `image` -> valid media URL/path only
  - `link` -> valid URL/path only
  - `text` -> string
- Product data maps to:
  - `/en/products` cards
  - `/en/products/:slug` detail renderer
- Role data maps to:
  - `/en/careers` `openRoles` table rows
- Commodity data maps to:
  - `/en/commodities` card/CTA slots
  - `/en/commodities/{slug}` template slots

## Recommended Runtime Data Folder

Use one folder with deterministic file names:

- `src/content/registry/site.json`
- `src/content/registry/locales.json`
- `src/content/registry/pages.json`
- `src/content/registry/content-slots.json`
- `src/content/registry/media.json`
- `src/content/registry/products.json`
- `src/content/registry/roles.json`
- `src/content/registry/commodities.json`
- `src/content/registry/relations.json`

## Integration Notes

- Keep Astro templates as rendering layer; move mutable values to registry JSON.
- At build time, load registry data in page frontmatter and bind by route key.
- Preserve existing route files (`src/pages/**`) and `data-slot` keys to avoid regressions.
