type SlotEntry = {
  type?: string;
  value?: unknown;
  note?: string;
};

type ContentDoc = {
  routeKey?: string;
  route?: string;
  generatedAt?: string;
  slots?: Record<string, SlotEntry>;
  warnings?: string[];
};

const pageModulesNew = import.meta.glob("../content-store/en/pages/*.json", {
  eager: true,
  import: "default",
}) as Record<string, ContentDoc>;

const pageModulesLegacy = import.meta.glob("../content-store/pages/en/*.json", {
  eager: true,
  import: "default",
}) as Record<string, ContentDoc>;

const globalModulesNew = import.meta.glob("../content-store/en/globals/*.json", {
  eager: true,
  import: "default",
}) as Record<string, ContentDoc>;

const globalModulesLegacy = import.meta.glob("../content-store/globals/*.json", {
  eager: true,
  import: "default",
}) as Record<string, ContentDoc>;

const warned = new Set<string>();

function warnOnce(message: string) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`[content-store] ${message}`);
}

function findModule<T>(modules: Record<string, T>, fileName: string): T | undefined {
  const entry = Object.entries(modules).find(([key]) => key.endsWith(fileName));
  return entry?.[1];
}

export async function loadPageContent(routeKey: string): Promise<ContentDoc> {
  const fileName = `${routeKey}.json`;
  const fromNew = findModule(pageModulesNew, fileName);
  if (fromNew) return fromNew;

  const fromLegacy = findModule(pageModulesLegacy, fileName);
  if (fromLegacy) return fromLegacy;

  warnOnce(`Missing page content file for routeKey "${routeKey}"`);
  return {};
}

export async function loadGlobalContent(key: "header" | "footer"): Promise<ContentDoc> {
  const fileName = `${key}.json`;
  const fromNew = findModule(globalModulesNew, fileName);
  if (fromNew) return fromNew;

  const fromLegacy = findModule(globalModulesLegacy, `${key}.en.json`) ?? findModule(globalModulesLegacy, fileName);
  if (fromLegacy) return fromLegacy;

  warnOnce(`Missing global content file for key "${key}"`);
  return {};
}

export function getSlot(content: ContentDoc | null | undefined, key: string, fallback: string): string {
  const value = content?.slots?.[key]?.value;
  if (typeof value === "string") {
    return value;
  }
  warnOnce(`Missing slot "${key}"`);
  return fallback;
}

export type HeroTitleItem = { text: string; start: number; end: number };

export function getHeroTitles(content: ContentDoc | null | undefined): HeroTitleItem[] {
  const raw = content?.slots?.["hero-titles"]?.value;
  if (typeof raw !== "string") return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (x): x is HeroTitleItem =>
        x && typeof x.text === "string" && typeof x.start === "number" && typeof x.end === "number"
    );
  } catch {
    return [];
  }
}

import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

export type ProductDoc = {
  slug: string;
  title?: string;
  heroImage?: string;
  description?: string;
  overview?: string;
  specifications?: Array<{ label?: string; value?: string }>;
  origins?: string[];
  certifications?: string[];
  cta?: { label?: string; href?: string };
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.join(process.cwd(), "src", "content-store", "collections", "products");

export function loadProduct(slug: string): ProductDoc | null {
  try {
    const filePath = path.join(PRODUCTS_DIR, `${slug}.json`);
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as ProductDoc;
  } catch {
    return null;
  }
}

export function loadAllProducts(): ProductDoc[] {
  let slugs: string[] = [];
  try {
    const indexPath = path.join(PRODUCTS_DIR, "index.json");
    const indexRaw = fs.readFileSync(indexPath, "utf8");
    const index = JSON.parse(indexRaw) as { order?: string[] };
    slugs = index.order ?? [];
  } catch {
    slugs = ["sugar", "wheat", "oils", "urea", "maritime-transport"];
  }
  return slugs
    .map((slug) => loadProduct(slug))
    .filter((p): p is ProductDoc => p !== null);
}
