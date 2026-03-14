/**
 * Resolves optimized image URLs for frontend delivery.
 * Uses MEDIA_INVENTORY to include only existing variant widths (avoids 404 for images smaller than 1920px).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type ImageVariant = "thumbnail" | "card" | "standard" | "hero";

const VARIANT_WIDTHS: Record<ImageVariant, number> = {
  thumbnail: 400,
  card: 800,
  standard: 1200,
  hero: 1920,
};

type InventoryAsset = {
  publicUrl?: string;
  variants?: Record<string, { width: number; url: string } | null>;
};

type Inventory = { assets?: InventoryAsset[] };

let inventoryCache: Inventory | null = null;

function getInventory(): Inventory {
  if (inventoryCache) return inventoryCache;
  try {
    const root = process.cwd();
    const path = join(root, "_system", "MEDIA_INVENTORY.json");
    inventoryCache = JSON.parse(readFileSync(path, "utf-8")) as Inventory;
  } catch {
    inventoryCache = { assets: [] };
  }
  return inventoryCache;
}

function getAvailableWidths(src: string): number[] | null {
  const inv = getInventory();
  const item = inv?.assets?.find((a) => a.publicUrl === src);
  if (!item?.variants) return null;
  const widths = Object.values(item.variants)
    .filter((v): v is { width: number; url: string } => v != null)
    .map((v) => v.width)
    .sort((a, b) => a - b);
  return widths.length > 0 ? widths : null;
}

function isLocalAsset(src: string): boolean {
  return typeof src === "string" && src.startsWith("/assets/figma/") && !src.includes("/optimized/");
}

function getBaseName(path: string): string {
  const match = path.match(/\/assets\/figma\/(.+)\.(jpg|jpeg|png|webp|gif)$/i);
  if (!match) return "";
  return match[1];
}

export type OptimizedImageResult = {
  src: string;
  srcSet: string;
  sizes: string;
  width?: number;
  height?: number;
};

/**
 * Returns optimized src, srcSet, and sizes for an image path.
 * Only includes variant widths that exist in MEDIA_INVENTORY (avoids 404 on hero for images < 1920px).
 */
export function getOptimizedImage(
  src: string,
  variant: ImageVariant = "standard",
  _aspectRatio?: number
): OptimizedImageResult {
  if (!src || !isLocalAsset(src)) {
    return {
      src,
      srcSet: "",
      sizes: "100vw",
    };
  }

  const base = getBaseName(src);
  if (!base) {
    return { src, srcSet: "", sizes: "100vw" };
  }

  const targetWidth = VARIANT_WIDTHS[variant];
  const availableWidths = getAvailableWidths(src);
  const safeWidths = availableWidths ?? [400, 800, 1200];

  const srcSetParts: string[] = [];
  for (const w of safeWidths) {
    srcSetParts.push(`/assets/figma/optimized/${base}-${w}.webp ${w}w`);
  }

  let sizes: string;
  switch (variant) {
    case "thumbnail":
      sizes = "(max-width: 640px) 100vw, 400px";
      break;
    case "card":
      sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px";
      break;
    case "hero":
      sizes = "100vw";
      break;
    default:
      sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px";
  }

  return {
    src,
    srcSet: srcSetParts.join(", "),
    sizes,
  };
}
