# SEO Validation (Static Build)

One-shot validation checks canonical/hreflang normalization in generated HTML.

## Run

From `Astro_Site/`:

```bash
npm run build
npm run seo:verify
```

## What it checks

- Scans `dist/**/index.html`
- Validates canonical link exists and ends with `/`
- Validates all `hreflang` links end with `/`
- Validates `hreflang="x-default"` points to `/en/`
- Prints summary counts and exits non-zero on failure
