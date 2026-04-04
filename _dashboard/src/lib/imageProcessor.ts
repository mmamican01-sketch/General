/**
 * Image processing pipeline for uploaded media.
 * Generates optimized WebP variants and stores metadata.
 */
import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";
import { MEDIA_ROOT } from "./workspace";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_DIMENSION = 6000;

export const VARIANT_SIZES = {
  thumbnail: 400,
  card: 800,
  standard: 1200,
  hero: 1920,
} as const;

export type VariantKey = keyof typeof VARIANT_SIZES;

export type ImageVariant = {
  width: number;
  url: string;
  format: "webp";
};

export type ProcessedImageMeta = {
  originalPath: string;
  publicUrl: string;
  optimizedUrl?: string;
  webpUrl?: string;
  variants: Record<VariantKey, ImageVariant | null>;
  width: number;
  height: number;
  mimeType: string;
  fileSize: number;
};

const SUPPORTED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function isSupportedImage(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return SUPPORTED_EXT.includes(ext);
}

export function validateUpload(file: { size: number; name: string }): { ok: boolean; error?: string } {
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: `File too large. Max ${MAX_UPLOAD_BYTES / 1024 / 1024} MB` };
  }
  if (!isSupportedImage(file.name)) {
    return { ok: false, error: `Unsupported format. Use: ${SUPPORTED_EXT.join(", ")}` };
  }
  return { ok: true };
}

function getOptimizedDir(): string {
  return path.join(MEDIA_ROOT, "optimized");
}

function getVariantPath(originalName: string, variant: VariantKey): string {
  const base = path.basename(originalName, path.extname(originalName));
  return path.join(getOptimizedDir(), `${base}-${VARIANT_SIZES[variant]}.webp`);
}

function getVariantUrl(originalName: string, variant: VariantKey): string {
  const base = path.basename(originalName, path.extname(originalName));
  return `/assets/figma/optimized/${base}-${VARIANT_SIZES[variant]}.webp`;
}

export async function processImage(
  absPath: string,
  originalName: string,
  publicUrl: string
): Promise<ProcessedImageMeta | null> {
  if (!isSupportedImage(originalName)) return null;
  let width: number;
  let height: number;
  let format: string | undefined;

  try {
    const meta = await sharp(absPath).metadata();
    width = meta.width ?? 0;
    height = meta.height ?? 0;
    format = meta.format;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      return null;
    }
  } catch {
    return null;
  }

  const stats = await fs.stat(absPath);
  const variants: Record<VariantKey, ImageVariant | null> = {
    thumbnail: null,
    card: null,
    standard: null,
    hero: null,
  };

  await fs.mkdir(getOptimizedDir(), { recursive: true });

  for (const [key, maxWidth] of Object.entries(VARIANT_SIZES) as [VariantKey, number][]) {
    if (width <= maxWidth) continue;

    const outPath = getVariantPath(originalName, key);
    const outUrl = getVariantUrl(originalName, key);

    try {
      await sharp(absPath)
        .resize(maxWidth, undefined, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outPath);
      variants[key] = { width: maxWidth, url: outUrl, format: "webp" };
    } catch {
      variants[key] = null;
    }
  }

  const smallestVariant = variants.thumbnail ?? variants.card ?? variants.standard ?? variants.hero;
  const optimizedUrl = smallestVariant?.url ?? publicUrl;
  const webpUrl = smallestVariant?.url ?? publicUrl;

  return {
    originalPath: `public/assets/figma/${originalName}`,
    publicUrl,
    optimizedUrl,
    webpUrl,
    variants,
    width,
    height,
    mimeType: `image/${format ?? "jpeg"}`,
    fileSize: stats.size,
  };
}
