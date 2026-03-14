#!/usr/bin/env node
/**
 * Backfill script: process existing uploaded images to generate optimized variants.
 * Run from project root: node scripts/backfill-optimized-images.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MEDIA_ROOT = path.join(ROOT, "public", "assets", "figma");
const OPTIMIZED_DIR = path.join(MEDIA_ROOT, "optimized");
const SYSTEM_ROOT = path.join(ROOT, "_system");
const INV_PATH = path.join(SYSTEM_ROOT, "MEDIA_INVENTORY.json");

const VARIANT_SIZES = { thumbnail: 400, card: 800, standard: 1200, hero: 1920 };
const SUPPORTED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function isSupported(name) {
  return SUPPORTED_EXT.includes(path.extname(name).toLowerCase());
}

async function processFile(name) {
  const inputPath = path.join(MEDIA_ROOT, name);
  const publicUrl = `/assets/figma/${name}`;
  const base = path.basename(name, path.extname(name));
  const variants = { thumbnail: null, card: null, standard: null, hero: null };

  let width = 0;
  let height = 0;
  try {
    const meta = await sharp(inputPath).metadata();
    width = meta.width ?? 0;
    height = meta.height ?? 0;
  } catch (err) {
    console.warn(`  Skip ${name}: ${err.message}`);
    return null;
  }

  await fs.mkdir(OPTIMIZED_DIR, { recursive: true });

  for (const [key, maxW] of Object.entries(VARIANT_SIZES)) {
    if (width <= maxW) continue;
    const outPath = path.join(OPTIMIZED_DIR, `${base}-${maxW}.webp`);
    const outUrl = `/assets/figma/optimized/${base}-${maxW}.webp`;
    try {
      await sharp(inputPath)
        .resize(maxW, undefined, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outPath);
      variants[key] = { width: maxW, url: outUrl, format: "webp" };
    } catch (err) {
      console.warn(`  Variant ${key} failed: ${err.message}`);
    }
  }

  const stats = await fs.stat(inputPath);
  const smallest = variants.thumbnail ?? variants.card ?? variants.standard ?? variants.hero;
  return {
    path: `public/assets/figma/${name}`,
    publicUrl,
    optimizedUrl: smallest?.url ?? publicUrl,
    webpUrl: smallest?.url ?? publicUrl,
    variants,
    width,
    height,
    mimeType: `image/${path.extname(name).slice(1)}`,
    fileSize: stats.size,
  };
}

async function main() {
  console.log("Backfilling optimized image variants...\n");
  const entries = await fs.readdir(MEDIA_ROOT, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && isSupported(e.name))
    .map((e) => e.name);

  let inv = { assets: [] };
  try {
    const raw = await fs.readFile(INV_PATH, "utf8");
    inv = JSON.parse(raw);
  } catch {
    console.warn("MEDIA_INVENTORY.json not found or invalid, will create new entries.");
  }

  const assets = inv.assets || [];
  const byPath = new Map(assets.map((a) => [a.publicUrl ?? a.path, a]));
  let processed = 0;

  for (const name of files) {
    const publicUrl = `/assets/figma/${name}`;
    const existing = assets.find((a) => (a.publicUrl ?? a.path).includes(name));
    if (existing?.variants && Object.keys(existing.variants).length > 0) {
      console.log(`  Skip ${name} (already has variants)`);
      continue;
    }

    console.log(`  Processing ${name}...`);
    const meta = await processFile(name);
    if (meta) {
      const idx = assets.findIndex((a) => (a.publicUrl ?? a.path).includes(name));
      const entry = {
        path: meta.path,
        publicUrl: meta.publicUrl,
        type: "image",
        width: meta.width,
        height: meta.height,
        mimeType: meta.mimeType,
        fileSize: meta.fileSize,
        optimizedUrl: meta.optimizedUrl,
        webpUrl: meta.webpUrl,
        variants: meta.variants,
      };
      if (idx >= 0) {
        assets[idx] = { ...assets[idx], ...entry };
      } else {
        assets.push(entry);
      }
      processed++;
    }
  }

  inv.assets = assets;
  await fs.mkdir(path.dirname(INV_PATH), { recursive: true });
  await fs.writeFile(INV_PATH, JSON.stringify(inv, null, 2), "utf8");
  console.log(`\nDone. Processed ${processed} images.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
