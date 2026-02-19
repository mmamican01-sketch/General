import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ASTRO_ROOT = path.resolve(__dirname, "..", "..", "..");
export const CONTENT_ROOT = path.join(ASTRO_ROOT, "src", "content-store", "en");
export const MEDIA_ROOT = path.join(ASTRO_ROOT, "public", "assets", "figma");
export const SYSTEM_ROOT = path.join(ASTRO_ROOT, "_system");
export const COLLECTIONS_ROOT = path.join(ASTRO_ROOT, "src", "content-store", "collections");

export const PAGES_ROOT = path.join(CONTENT_ROOT, "pages");
export const GLOBALS_ROOT = path.join(CONTENT_ROOT, "globals");

export function toPageFilePath(key: string) {
  return path.join(PAGES_ROOT, `${key}.json`);
}

export function toPageFilePathForLocale(key: string, locale = "en") {
  const localeRoot = path.join(ASTRO_ROOT, "src", "content-store", locale, "pages");
  return path.join(localeRoot, `${key}.json`);
}

export function toGlobalFilePath(key: string) {
  return path.join(GLOBALS_ROOT, `${key}.json`);
}

export function toCollectionFilePath(collection: string, slug: string) {
  return path.join(COLLECTIONS_ROOT, collection, `${slug}.json`);
}

export async function ensureStoreDirs() {
  await fs.mkdir(PAGES_ROOT, { recursive: true });
  await fs.mkdir(GLOBALS_ROOT, { recursive: true });
  await fs.mkdir(MEDIA_ROOT, { recursive: true });
}

export function isSafeKey(key: string) {
  return /^[a-z0-9][a-z0-9-_]*$/i.test(key);
}
