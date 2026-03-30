import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ensureStoreDirs,
  isSafeKey,
  toPageFilePathForLocale,
  toCollectionFilePath,
} from "@/lib/workspace";
import { readJsonFile, writeJsonFile } from "@/lib/content-store";
import { requireAuthApi } from "@/lib/auth";
import { broadcastContentUpdated } from "@/lib/live";
import { triggerRebuild } from "@/lib/trigger-rebuild";

const slotSchema = z.object({
  type: z.string(),
  value: z.string(),
  note: z.string().optional(),
});

const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
}).optional();

const pageSchema = z.object({
  routeKey: z.string().min(1),
  route: z.string().min(1),
  generatedAt: z.string().optional(),
  slots: z.record(z.string(), slotSchema),
  seo: seoSchema,
  warnings: z.array(z.string()).optional(),
});

const productSchema = z.object({
  slug: z.string(),
  title: z.string().optional(),
  heroImage: z.string().optional(),
  description: z.string().optional(),
  overview: z.string().optional(),
  specifications: z.array(z.record(z.unknown())).optional(),
  origins: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  cta: z.record(z.unknown()).optional(),
  seo: seoSchema,
}).passthrough();

const insightSchema = z.object({
  slug: z.string(),
  title: z.string().optional(),
  shortDescription: z.string().optional(),
  coverImage: z.string().optional(),
  body: z.string().optional(),
  publishDate: z.string().optional(),
  author: z.string().optional(),
  readingTime: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaLink: z.string().optional(),
  isPublished: z.boolean().optional(),
}).passthrough();

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuthApi();
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const collection = searchParams.get("collection");
    const slug = searchParams.get("slug");
    const locale = searchParams.get("locale") || "en";

    if (page) {
      if (!isSafeKey(page)) return NextResponse.json({ error: "Invalid page key" }, { status: 400 });
      const filePath = toPageFilePathForLocale(page, locale);
      const data = await readJsonFile(filePath);
      return NextResponse.json(data);
    }

    if (collection && slug) {
      if (!isSafeKey(collection) || !isSafeKey(slug)) {
        return NextResponse.json({ error: "Invalid collection/slug" }, { status: 400 });
      }
      const filePath = toCollectionFilePath(collection, slug);
      const data = await readJsonFile(filePath);
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: "Provide ?page=key&locale=en OR ?collection=X&slug=Y&locale=en" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 404 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuthApi();
    if (!auth.ok) return auth.response;

    await ensureStoreDirs();

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const collection = searchParams.get("collection");
    const slug = searchParams.get("slug");
    const locale = searchParams.get("locale") || "en";

    const body = await req.json();

    if (page) {
      if (!isSafeKey(page)) return NextResponse.json({ error: "Invalid page key" }, { status: 400 });
      const parsed = pageSchema.parse(body);
      const filePath = toPageFilePathForLocale(page, locale);
      await writeJsonFile(filePath, parsed);
      broadcastContentUpdated({ type: "page", key: page, locale });
      triggerRebuild();
      return NextResponse.json({ ok: true });
    }

    if (collection && slug) {
      if (!isSafeKey(collection) || !isSafeKey(slug)) {
        return NextResponse.json({ error: "Invalid collection/slug" }, { status: 400 });
      }
      const schema = collection === "insights" ? insightSchema : productSchema;
      const parsed = schema.parse(body);
      const filePath = toCollectionFilePath(collection, slug);
      await writeJsonFile(filePath, parsed);
      broadcastContentUpdated({ type: "collection", collection, slug, locale });
      triggerRebuild();
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: "Provide ?page=key&locale=en OR ?collection=X&slug=Y&locale=en" },
      { status: 400 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
      return NextResponse.json({ error: messages }, { status: 400 });
    }
    console.error("[content API] PUT error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
