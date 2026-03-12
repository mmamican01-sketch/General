import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const STORE_DIR = path.join(ROOT, "src", "content-store");
const PAGES_EN_DIR = path.join(STORE_DIR, "pages", "en");
const PRODUCTS_DIR = path.join(STORE_DIR, "collections", "products");
const META_DIR = path.join(STORE_DIR, "_meta");

function routeToEnFileName(route) {
  if (route === "/en") return "index.json";
  if (!route.startsWith("/en/")) return null;
  const body = route.slice("/en/".length).replace(/\/+$/, "");
  return `${body.replace(/:slug/g, "slug").replace(/\//g, "__")}.json`;
}

async function listFilesRec(dir) {
  const out = [];
  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else {
        out.push(full);
      }
    }
  }
  await walk(dir);
  return out;
}

function isJsonFile(file) {
  return file.toLowerCase().endsWith(".json");
}

function isValidImagePath(value) {
  return value.startsWith("/assets/") || value.startsWith("/assets/cms/");
}

function collectImagePathErrors(value, keyPath, errors, fileRel) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectImagePathErrors(v, `${keyPath}[${i}]`, errors, fileRel));
    return;
  }

  if (!value || typeof value !== "object") return;

  // Validate slot objects: { type: "image", value: "..." }
  if (typeof value.type === "string" && value.type === "image" && typeof value.value === "string") {
    if (value.value.trim().length > 0 && !isValidImagePath(value.value)) {
      errors.push(`Invalid image path at ${keyPath}.value in ${fileRel}: ${value.value}`);
    }
  }

  // Validate explicit product/media image fields (actual content files only)
  if (typeof value.heroImage === "string") {
    if (value.heroImage.trim().length > 0 && !isValidImagePath(value.heroImage)) {
      errors.push(`Invalid image path at ${keyPath}.heroImage in ${fileRel}: ${value.heroImage}`);
    }
  }

  for (const [k, v] of Object.entries(value)) {
    collectImagePathErrors(v, `${keyPath}.${k}`, errors, fileRel);
  }
}

async function main() {
  const errors = [];

  const allFiles = await listFilesRec(STORE_DIR);
  const jsonFiles = allFiles.filter(isJsonFile);

  for (const file of jsonFiles) {
    const raw = await fs.readFile(file, "utf8");
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      errors.push(`JSON parse failed: ${path.relative(ROOT, file)} (${err.message})`);
      continue;
    }
    const fileRel = path.relative(ROOT, file);
    // Restrict image-path checks to editable content files, not schema metadata.
    const shouldCheckImagePaths =
      fileRel.startsWith(path.join("src", "content-store", "pages", "en")) ||
      fileRel.startsWith(path.join("src", "content-store", "collections", "products")) ||
      fileRel.startsWith(path.join("src", "content-store", "globals"));
    if (shouldCheckImagePaths) {
      collectImagePathErrors(parsed, fileRel, errors, fileRel);
    }
  }

  // Route file existence check for EN
  const siteTreePath = path.join(META_DIR, "site-tree.json");
  const siteTree = JSON.parse(await fs.readFile(siteTreePath, "utf8"));
  const routes = Array.isArray(siteTree.routes) ? siteTree.routes : [];
  const enRoutes = routes.filter((r) => r.route === "/en" || String(r.route).startsWith("/en/"));
  for (const routeRow of enRoutes) {
    const fileName = routeToEnFileName(routeRow.route);
    if (!fileName) continue;
    const fullPath = path.join(PAGES_EN_DIR, fileName);
    try {
      await fs.access(fullPath);
    } catch {
      errors.push(`Missing EN route file: ${path.relative(ROOT, fullPath)} for route ${routeRow.route}`);
    }
  }

  // Dynamic product slugs check
  const productIndexPath = path.join(PRODUCTS_DIR, "index.json");
  const productIndex = JSON.parse(await fs.readFile(productIndexPath, "utf8"));
  const order = Array.isArray(productIndex.order) ? productIndex.order : [];

  for (const slug of order) {
    const productFile = path.join(PRODUCTS_DIR, `${slug}.json`);
    try {
      await fs.access(productFile);
    } catch {
      errors.push(`Missing product file for slug '${slug}': ${path.relative(ROOT, productFile)}`);
    }
  }

  const productFiles = (await fs.readdir(PRODUCTS_DIR))
    .filter((f) => f.endsWith(".json") && f !== "index.json")
    .map((f) => f.replace(/\.json$/i, ""))
    .sort();
  const orderSorted = [...order].sort();
  if (JSON.stringify(productFiles) !== JSON.stringify(orderSorted)) {
    errors.push(
      `Product index/order mismatch. index.json=${JSON.stringify(orderSorted)} files=${JSON.stringify(productFiles)}`
    );
  }

  if (errors.length > 0) {
    console.error("CONTENT STORE: FAIL");
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }

  console.log("CONTENT STORE: OK");
}

main().catch((err) => {
  console.error("CONTENT STORE: FAIL");
  console.error(err);
  process.exit(1);
});
