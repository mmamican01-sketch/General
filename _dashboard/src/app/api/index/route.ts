import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAuthApi } from "@/lib/auth";
import { ASTRO_ROOT, CONTENT_ROOT, SYSTEM_ROOT, COLLECTIONS_ROOT, PAGES_ROOT } from "@/lib/workspace";

type ContentSlots = Record<
  string,
  { file: string; slots: Array<{ key: string; type: string; selectorHint?: string }> }
>;
type CollectionsSchema = {
  dynamicRoutes?: Array<{
    route: string;
    slugSource?: { type: string; values?: string[] };
  }>;
  collections?: Record<string, { primaryKey?: string; fields?: Record<string, string> }>;
};
type MediaInventory = { assets?: Array<{ path: string; type: string; publicUrl?: string }> };

function routeToKey(route: string, locale: string): string | null {
  const prefix = `/${locale}`;
  if (!route.startsWith(prefix)) return null;
  let rest = route.slice(prefix.length) || "/";
  if (rest === "/") return "index";
  rest = rest.replace(/^\//, "").replace(/\/$/, "");
  if (!rest) return "index";
  return rest.replace(/\//g, "__");
}

export async function GET() {
  try {
    const auth = await requireAuthApi();
    if (!auth.ok) return auth.response;
    const contentSlotsRaw = await fs
      .readFile(path.join(SYSTEM_ROOT, "CONTENT_SLOTS.json"), "utf8")
      .catch(() => "{}");
    const collectionsRaw = await fs
      .readFile(path.join(SYSTEM_ROOT, "COLLECTIONS_SCHEMA.json"), "utf8")
      .catch(() => "{}");
    const mediaRaw = await fs
      .readFile(path.join(SYSTEM_ROOT, "MEDIA_INVENTORY.json"), "utf8")
      .catch(() => "{}");

    const contentSlots: ContentSlots = JSON.parse(contentSlotsRaw);
    const collectionsSchema: CollectionsSchema = JSON.parse(collectionsRaw);
    const mediaInventory: MediaInventory = JSON.parse(mediaRaw);

    const pages: Array<{
      key: string;
      path: string;
      file: string;
      slots: Array<{ key: string; type: string; selectorHint?: string }>;
    }> = [];
    const keyToRoute: Record<string, string> = {};
    for (const route of Object.keys(contentSlots)) {
      if (route.includes(":slug")) continue;
      const key = routeToKey(route, "en");
      if (key) keyToRoute[key] = route;
    }

    const pageFiles = await fs.readdir(PAGES_ROOT, { withFileTypes: true }).catch(() => []);
    for (const f of pageFiles) {
      if (!f.isFile() || !f.name.endsWith(".json")) continue;
      const key = f.name.replace(/\.json$/, "");
      const filePath = path.join(PAGES_ROOT, f.name);
      const relPath = path.relative(ASTRO_ROOT, filePath);
      const route = keyToRoute[key] ?? (key === "index" ? "/en/" : `/en/${key.replace(/__/g, "/")}`);
      const meta = contentSlots[route] as { slots?: Array<{ key: string; type: string; selectorHint?: string }> } | undefined;
      pages.push({
        key,
        path: route,
        file: relPath.replace(/\\/g, "/"),
        slots: meta?.slots || [],
      });
    }
    pages.sort((a, b) => a.key.localeCompare(b.key));

    const collections: Array<{
      collection: string;
      route: string;
      items: Array<{
        slug: string;
        file: string;
        schema: Record<string, string>;
      }>;
    }> = [];

    const collDirs = await fs.readdir(COLLECTIONS_ROOT, { withFileTypes: true }).catch(() => []);

    for (const ent of collDirs) {
      if (!ent.isDirectory()) continue;
      const collName = ent.name;
      const collDir = path.join(COLLECTIONS_ROOT, collName);

      const cap = collName.charAt(0).toUpperCase() + collName.slice(1);
      const singular = cap.endsWith("s") ? cap.slice(0, -1) : cap;
      const collSchema = collectionsSchema.collections?.[cap]
        || collectionsSchema.collections?.[singular]
        || collectionsSchema.collections?.[collName];

      const schema: Record<string, string> = collSchema?.fields || {};

      const dynRoute = collectionsSchema.dynamicRoutes?.find((r) =>
        r.route.includes(`/${collName}/:slug`) || r.route.includes(`/${collName}s/:slug`)
      );
      const routeTemplate = dynRoute
        ? dynRoute.route
        : `/en/${collName}/:slug`;

      const files = await fs.readdir(collDir, { withFileTypes: true }).catch(() => []);
      const items: Array<{ slug: string; file: string; schema: Record<string, string> }> = [];

      for (const f of files) {
        if (!f.isFile() || f.name === "index.json" || !f.name.endsWith(".json")) continue;
        const slug = f.name.replace(/\.json$/, "");
        const itemPath = path.join(collDir, f.name);
        const relPath = path.relative(ASTRO_ROOT, itemPath);
        items.push({
          slug,
          file: relPath.replace(/\\/g, "/"),
          schema,
        });
      }

      if (items.length > 0) {
        collections.push({
          collection: collName,
          route: routeTemplate,
          items,
        });
      }
    }

    const media = (mediaInventory.assets || []).map((a) => ({
      path: a.publicUrl ?? a.path,
      type: a.type,
    }));

    return NextResponse.json({
      pages,
      collections,
      media,
    });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
