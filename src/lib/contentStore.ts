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

export type InsightDoc = {
  title?: string;
  slug: string;
  shortDescription?: string;
  coverImage?: string;
  body?: string;
  publishDate?: string;
  author?: string;
  readingTime?: string;
  category?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  ctaLabel?: string;
  ctaLink?: string;
  isPublished?: boolean;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.join(process.cwd(), "src", "content-store", "collections", "products");
const INSIGHTS_DIR = path.join(process.cwd(), "src", "content-store", "collections", "insights");

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

function parseDateOrZero(dateValue: string | undefined): number {
  if (!dateValue) return 0;
  const ts = Date.parse(dateValue);
  return Number.isNaN(ts) ? 0 : ts;
}

export function loadInsight(slug: string): InsightDoc | null {
  try {
    const filePath = path.join(INSIGHTS_DIR, `${slug}.json`);
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as InsightDoc;
  } catch {
    return null;
  }
}

export function slugifyLabel(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function loadAllInsights(options?: { includeUnpublished?: boolean }): InsightDoc[] {
  const includeUnpublished = options?.includeUnpublished ?? false;
  let slugs: string[] = [];
  try {
    const indexPath = path.join(INSIGHTS_DIR, "index.json");
    const indexRaw = fs.readFileSync(indexPath, "utf8");
    const index = JSON.parse(indexRaw) as { order?: string[] };
    slugs = index.order ?? [];
  } catch {
    try {
      const fileNames = fs.readdirSync(INSIGHTS_DIR);
      slugs = fileNames
        .filter((fileName) => fileName.endsWith(".json") && fileName !== "index.json")
        .map((fileName) => fileName.replace(/\.json$/, ""));
    } catch {
      slugs = [];
    }
  }

  const insights = slugs
    .map((slug) => loadInsight(slug))
    .filter((item): item is InsightDoc => item !== null);

  const filtered = includeUnpublished ? insights : insights.filter((item) => item.isPublished === true);
  return filtered.sort((a, b) => parseDateOrZero(b.publishDate) - parseDateOrZero(a.publishDate));
}

export function loadInsightsByCategory(categorySlug: string): InsightDoc[] {
  return loadAllInsights().filter(
    (item) => slugifyLabel(item.category ?? "") === categorySlug
  );
}

export function loadInsightsByTag(tagSlug: string): InsightDoc[] {
  return loadAllInsights().filter((item) =>
    (item.tags ?? []).some((tag) => slugifyLabel(tag) === tagSlug)
  );
}

export function getAllCategories(): Array<{ slug: string; label: string; count: number }> {
  const all = loadAllInsights();
  const map = new Map<string, { label: string; count: number }>();
  for (const item of all) {
    if (item.category) {
      const s = slugifyLabel(item.category);
      const existing = map.get(s);
      if (existing) {
        existing.count++;
      } else {
        map.set(s, { label: item.category, count: 1 });
      }
    }
  }
  return Array.from(map.entries()).map(([slug, { label, count }]) => ({ slug, label, count }));
}

export function getAllTags(): Array<{ slug: string; label: string; count: number }> {
  const all = loadAllInsights();
  const map = new Map<string, { label: string; count: number }>();
  for (const item of all) {
    for (const tag of item.tags ?? []) {
      const s = slugifyLabel(tag);
      const existing = map.get(s);
      if (existing) {
        existing.count++;
      } else {
        map.set(s, { label: tag, count: 1 });
      }
    }
  }
  return Array.from(map.entries()).map(([slug, { label, count }]) => ({ slug, label, count }));
}
