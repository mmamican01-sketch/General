import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const EN_PAGES_DIR = path.join(ROOT, "src", "pages", "en");
const HEADER_FILE = path.join(ROOT, "src", "components", "Header.astro");
const FOOTER_FILE = path.join(ROOT, "src", "components", "Footer.astro");

const OUT_BASE = path.join(ROOT, "src", "content-store", "en");
const OUT_PAGES = path.join(OUT_BASE, "pages");
const OUT_GLOBALS = path.join(OUT_BASE, "globals");
const OUT_MANIFEST = path.join(OUT_BASE, "_manifest.json");

function toPosix(p) {
  return p.replace(/\\/g, "/");
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

async function listAstroFiles(dir) {
  const out = [];
  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && entry.name.endsWith(".astro")) {
        out.push(full);
      }
    }
  }
  await walk(dir);
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

function routeFromEnFile(filePath) {
  const rel = toPosix(path.relative(EN_PAGES_DIR, filePath));
  if (rel === "index.astro") return "/en/";
  if (rel.endsWith("/index.astro")) return `/en/${rel.slice(0, -"/index.astro".length)}`;
  return `/en/${rel.slice(0, -".astro".length)}`;
}

function routeKeyFromEnRoute(route) {
  const clean = route.replace(/\/+$/, "");
  if (clean === "/en") return "index";
  const body = clean.replace(/^\/en\//, "");
  return body
    .replace(/\[(.+?)\]/g, "$1")
    .replace(/\//g, "__");
}

function getQuotedAttr(attrs, attrName) {
  const re = new RegExp(`${attrName}\\s*=\\s*"([^"]*)"`, "i");
  const m = attrs.match(re);
  return m ? m[1] : "";
}

function findClosingTagIndex(source, tagName, fromIndex) {
  const closing = `</${tagName}>`;
  return source.indexOf(closing, fromIndex);
}

function detectSlotValue(source, openTagMatch, tagName, attrs, startTagEnd) {
  const lowerTag = tagName.toLowerCase();
  if (lowerTag === "img") {
    return {
      type: "image",
      value: getQuotedAttr(attrs, "src"),
    };
  }
  if (lowerTag === "a") {
    return {
      type: "href",
      value: getQuotedAttr(attrs, "href"),
    };
  }

  const closeIdx = findClosingTagIndex(source, tagName, startTagEnd);
  if (closeIdx === -1) {
    return { type: "text", value: "", note: "manual" };
  }
  const inner = source.slice(startTagEnd, closeIdx);
  if (/<[a-zA-Z]/.test(inner)) {
    return { type: "text", value: "", note: "manual" };
  }
  return {
    type: "text",
    value: normalizeWhitespace(inner),
  };
}

function extractSlotsFromSource(source) {
  const slots = {};
  const warnings = [];
  const seen = new Set();
  const re = /<([a-zA-Z][\w:-]*)\b([^>]*?)\bdata-slot\s*=\s*"([^"]+)"([^>]*)>/gms;

  let m;
  while ((m = re.exec(source)) !== null) {
    const tagName = m[1];
    const attrs = `${m[2] || ""}${m[4] || ""}`;
    const slotKey = (m[3] || "").trim();
    if (!slotKey) continue;

    if (seen.has(slotKey)) {
      warnings.push(`duplicate slot key "${slotKey}"`);
      continue;
    }
    seen.add(slotKey);

    const startTagText = m[0];
    const startTagEnd = m.index + startTagText.length;
    const detected = detectSlotValue(source, m, tagName, attrs, startTagEnd);
    slots[slotKey] = detected.note
      ? { type: detected.type, value: detected.value, note: detected.note }
      : { type: detected.type, value: detected.value };
  }

  return { slots, warnings };
}

async function writeJson(targetFile, data) {
  await fs.writeFile(targetFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function ensureDirs() {
  await fs.mkdir(OUT_PAGES, { recursive: true });
  await fs.mkdir(OUT_GLOBALS, { recursive: true });
}

async function generatePagesManifest() {
  const pageFiles = await listAstroFiles(EN_PAGES_DIR);
  const pages = [];
  const now = new Date().toISOString();

  for (const filePath of pageFiles) {
    const route = routeFromEnFile(filePath);
    const routeKey = routeKeyFromEnRoute(route);
    const src = await fs.readFile(filePath, "utf8");
    const { slots, warnings } = extractSlotsFromSource(src);

    const out = {
      routeKey,
      route,
      generatedAt: now,
      slots,
    };
    if (warnings.length > 0) out.warnings = warnings;

    const outFile = path.join(OUT_PAGES, `${routeKey}.json`);
    await writeJson(outFile, out);
    pages.push({
      routeKey,
      route,
      file: `pages/${routeKey}.json`,
    });
  }

  pages.sort((a, b) => a.route.localeCompare(b.route));
  return pages;
}

async function generateGlobal(key, sourceFile) {
  const src = await fs.readFile(sourceFile, "utf8");
  const { slots, warnings } = extractSlotsFromSource(src);
  const out = {
    routeKey: key,
    route: key,
    generatedAt: new Date().toISOString(),
    slots,
  };
  if (warnings.length > 0) out.warnings = warnings;
  const outFile = path.join(OUT_GLOBALS, `${key}.json`);
  await writeJson(outFile, out);
  return { key, file: `globals/${key}.json` };
}

async function main() {
  await ensureDirs();

  const pages = await generatePagesManifest();
  const globals = [];
  globals.push(await generateGlobal("header", HEADER_FILE));
  globals.push(await generateGlobal("footer", FOOTER_FILE));

  const manifest = {
    locale: "en",
    pages,
    globals,
  };

  await writeJson(OUT_MANIFEST, manifest);
  console.log(`CONTENT STORE GENERATED: ${pages.length} pages, ${globals.length} globals`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
