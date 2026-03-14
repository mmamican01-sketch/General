# Image Optimization Pipeline

## Architecture Summary

- **Upload flow**: Unchanged. User uploads via MediaPicker → POST /api/media.
- **Processing**: After write, Sharp processes the image and generates WebP variants.
- **Storage**: Originals in `public/assets/figma/`, variants in `public/assets/figma/optimized/`.
- **Metadata**: MEDIA_INVENTORY.json extended with `variants`, `optimizedUrl`, `webpUrl`, `width`, `height`, `fileSize`.
- **Delivery**: Frontend uses `getOptimizedImage()` to resolve srcset/sizes. MediaFrame and OptimizedImg use optimized URLs with original as fallback.

## Files Created/Updated

### Created
- `_dashboard/src/lib/imageProcessor.ts` – Sharp pipeline, validation, variant generation
- `src/lib/imageOptimizer.ts` – Resolves optimized URLs for frontend (convention-based)
- `src/components/OptimizedImg.astro` – img with srcset/sizes for full-bleed images
- `scripts/backfill-optimized-images.mjs` – Backfill existing images
- `docs/IMAGE_OPTIMIZATION.md` – This file

### Updated
- `_dashboard/src/app/api/media/route.ts` – Validation, processImage call, extended inventory
- `src/components/MediaFrame.astro` – srcset, sizes, variant prop
- `src/pages/en/index.astro` – OptimizedImg for stats banner, variant props on MediaFrame
- `package.json` – `backfill:images` script, sharp devDependency

## Variants Generated

| Variant   | Max Width | Use Case              |
|-----------|-----------|------------------------|
| thumbnail | 400px     | Thumbnails, small cards |
| card      | 800px     | Product cards, grids   |
| standard  | 1200px    | Section images        |
| hero      | 1920px    | Banners, full-bleed   |

Variants are only generated when the source image is larger than the target width.

## New Upload Behavior

1. User uploads image (max 10 MB, supported: jpg, jpeg, png, webp, gif).
2. File is validated (size, type).
3. Original is written to `public/assets/figma/`.
4. Sharp generates WebP variants (400, 800, 1200, 1920) in `public/assets/figma/optimized/`.
5. MEDIA_INVENTORY is updated with variants metadata.
6. MediaPicker returns the original path; frontend resolves optimized URLs automatically.

## Backfill Existing Images

```bash
npm run backfill:images
```

Processes all images in `public/assets/figma/` and generates variants. Updates MEDIA_INVENTORY.

## Frontend Usage

- **MediaFrame**: Use `variant="card"` for product grids, `variant="standard"` for sections, `variant="hero"` for large images.
- **OptimizedImg**: For raw img tags (banners, backgrounds). `variant="hero"` for full-bleed.
- External URLs (e.g. Unsplash) pass through unchanged.

## Config / Env

No env changes required. Limits are in `imageProcessor.ts`:
- `MAX_UPLOAD_BYTES`: 10 MB
- `MAX_DIMENSION`: 6000px

## Verification Checklist

- [x] Upload works
- [x] Variants generated in `optimized/`
- [x] Frontend serves srcset
- [x] Lazy loading on MediaFrame (default)
- [x] Eager loading for above-the-fold (stats banner)
- [x] No broken media URLs (original as fallback)
- [x] Build succeeds
