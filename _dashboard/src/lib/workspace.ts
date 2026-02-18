import path from "node:path";
import fs from "node:fs/promises";

export const ASTRO_ROOT = path.resolve(process.cwd(), "..");
export const CONTENT_ROOT = path.join(ASTRO_ROOT, "src", "content-store", "en");
export const MEDIA_ROOT = path.join(ASTRO_ROOT, "public", "assets", "figma");

export const PAGES_ROOT = path.join(CONTENT_ROOT, "pages");
export const GLOBALS_ROOT = path.join(CONTENT_ROOT, "globals");

export function toPageFilePath(key: string) {
  return path.join(PAGES_ROOT, `${key}.json`);
}

export function toGlobalFilePath(key: string) {
  return path.join(GLOBALS_ROOT, `${key}.json`);
}

export async function ensureStoreDirs() {
  await fs.mkdir(PAGES_ROOT, { recursive: true });
  await fs.mkdir(GLOBALS_ROOT, { recursive: true });
  await fs.mkdir(MEDIA_ROOT, { recursive: true });
}

export function isSafeKey(key: string) {
  return /^[a-z0-9][a-z0-9-_]*$/i.test(key);
}
