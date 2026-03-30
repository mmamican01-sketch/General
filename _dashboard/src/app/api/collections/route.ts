import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";
import {
  ensureStoreDirs,
  isSafeKey,
  toCollectionFilePath,
  COLLECTIONS_ROOT,
} from "@/lib/workspace";
import { readJsonFile, writeJsonFile } from "@/lib/content-store";
import { requireAuthApi } from "@/lib/auth";
import { broadcastContentUpdated } from "@/lib/live";
import { triggerRebuild } from "@/lib/trigger-rebuild";

const createSchema = z.object({
  collection: z.string().min(1),
  slug: z.string().min(1),
});

const insightTemplate = (slug: string) => ({
  slug,
  title: "",
  shortDescription: "",
  coverImage: "",
  body: "",
  publishDate: new Date().toISOString().split("T")[0],
  author: "AFGT Market Desk",
  readingTime: "",
  category: "Trade Insights",
  tags: [] as string[],
  seoTitle: "",
  seoDescription: "",
  ogImage: "",
  ctaLabel: "",
  ctaLink: "",
  isPublished: false,
});

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuthApi();
    if (!auth.ok) return auth.response;

    await ensureStoreDirs();
    const payload = createSchema.parse(await req.json());

    if (!isSafeKey(payload.collection) || !isSafeKey(payload.slug)) {
      return NextResponse.json({ error: "Invalid collection or slug format" }, { status: 400 });
    }

    const collDir = path.join(COLLECTIONS_ROOT, payload.collection);
    const indexPath = path.join(collDir, "index.json");
    const filePath = toCollectionFilePath(payload.collection, payload.slug);

    try {
      await fs.access(filePath);
      return NextResponse.json({ error: "An item with this slug already exists" }, { status: 409 });
    } catch {
      /* file does not exist, OK to create */
    }

    let template: Record<string, unknown>;
    if (payload.collection === "insights") {
      template = insightTemplate(payload.slug);
    } else if (payload.collection === "products") {
      template = {
        slug: payload.slug,
        title: "",
        heroImage: "",
        description: "",
        overview: "",
      };
    } else {
      template = { slug: payload.slug };
    }

    await fs.mkdir(collDir, { recursive: true });
    await writeJsonFile(filePath, template);

    try {
      const index = (await readJsonFile(indexPath)) as { order?: string[] };
      const order = Array.isArray(index?.order) ? index.order : [];
      if (!order.includes(payload.slug)) {
        order.unshift(payload.slug);
        await writeJsonFile(indexPath, { ...index, order });
      }
    } catch {
      await writeJsonFile(indexPath, { collection: payload.collection, order: [payload.slug] });
    }

    broadcastContentUpdated({ type: "collection", collection: payload.collection, slug: payload.slug, locale: "en" });
    triggerRebuild();

    return NextResponse.json({ ok: true, slug: payload.slug });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors.map((e) => e.message) }, { status: 400 });
    }
    console.error("[collections API] POST error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
