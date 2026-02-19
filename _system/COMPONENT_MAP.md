# Component Map

Deterministic map from `src/components/**/*.astro` and `src/layouts/**/*.astro`.

## Layouts

### `src/layouts/BaseLayout.astro`

- Imports:
  - `src/components/Header.astro`
  - `src/components/Footer.astro`
- Props consumed:
  - `title` (defaulted)
  - `description` (defaulted)
  - `locale` (required)
  - `currentPath` (default `""`)
- Used by:
  - `src/pages/en/index.astro`
  - `src/pages/en/about.astro`
  - `src/pages/en/who-we-are.astro`
  - `src/pages/en/products.astro`
  - `src/pages/en/products/[slug].astro`
  - `src/pages/en/sustainability.astro`
  - `src/pages/en/careers.astro`
  - `src/pages/en/careers/apply.astro`
  - `src/pages/en/contact.astro`
  - `src/pages/en/newsroom.astro`
  - `src/pages/en/commodities/index.astro`
  - `src/pages/en/commodities/sugar.astro`
  - `src/pages/en/commodities/wheat.astro`
  - `src/pages/en/commodities/barley.astro`
  - `src/pages/en/commodities/sunflower-oil.astro`
  - `src/pages/ar/index.astro`
  - `src/pages/ar/about.astro`
  - `src/pages/ar/who-we-are.astro`
  - `src/pages/ar/products.astro`
  - `src/pages/ar/sustainability.astro`
  - `src/pages/ar/careers.astro`
  - `src/pages/ar/careers/apply.astro`
  - `src/pages/ar/contact.astro`
  - `src/pages/ar/newsroom.astro`
  - `src/pages/ar/commodities/index.astro`
  - `src/pages/ar/commodities/sugar.astro`
  - `src/pages/ar/commodities/wheat.astro`
  - `src/pages/ar/commodities/barley.astro`
  - `src/pages/ar/commodities/sunflower-oil.astro`
  - `src/layouts/Layout.astro`

### `src/layouts/Layout.astro`

- Wrapper around `BaseLayout`.
- Props forwarded:
  - `locale`
  - `title`
  - `currentPath`
  - `description`
- Direct import usage: none found in `src/pages/**/*.astro`.

## Header/Footer (Critical)

### `src/components/Header.astro`

- Props consumed:
  - `locale` (default `en`)
  - `currentPath` (default `""`)
- Behavior:
  - Builds locale-aware links via `base = /en|/ar`.
  - Uses `currentPath` in `isActive()` for nav active state.
- Imported by:
  - `src/layouts/BaseLayout.astro` as `<Header locale={locale} currentPath={currentPath} />`.

### `src/components/Footer.astro`

- Props consumed:
  - `locale` (default `en`)
- Behavior:
  - Builds locale-aware links via `base = /en|/ar`.
- Imported by:
  - `src/layouts/BaseLayout.astro` as `<Footer locale={locale} />`.

## Shared Components

### `src/components/Container.astro`

- Props consumed:
  - `wide` (`false` by default)
- Usage sites:
  - `src/pages/en/about.astro`
  - `src/pages/en/newsroom.astro`
  - `src/pages/en/careers/apply.astro`
  - `src/pages/en/commodities/index.astro`
  - `src/pages/en/commodities/sugar.astro`
  - `src/pages/en/commodities/wheat.astro`
  - `src/pages/en/commodities/barley.astro`
  - `src/pages/en/commodities/sunflower-oil.astro`

### `src/components/Welcome.astro`

- Imports local assets:
  - `src/assets/astro.svg`
  - `src/assets/background.svg`
- Usage sites:
  - no imports found in `src/pages/**/*.astro` or `src/layouts/**/*.astro`.
