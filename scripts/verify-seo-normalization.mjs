import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const DIST_DIR = resolve(process.cwd(), "dist");

async function walk(dir) {
  const entries = await readdir(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const fileStat = await stat(fullPath);

    if (fileStat.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (entry === "index.html") {
      files.push(fullPath);
    }
  }

  return files;
}

function extractFirstCanonicalHref(html) {
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  return canonicalMatch?.[1] ?? null;
}

function extractAlternateLinks(html) {
  const alternates = [];
  const regex = /<link[^>]*rel=["']alternate["'][^>]*>/gi;

  for (const match of html.matchAll(regex)) {
    const tag = match[0];
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    const hreflangMatch = tag.match(/hreflang=["']([^"']+)["']/i);

    if (hrefMatch && hreflangMatch) {
      alternates.push({
        href: hrefMatch[1],
        hreflang: hreflangMatch[1].toLowerCase(),
      });
    }
  }

  return alternates;
}

function endsWithSlash(urlValue) {
  try {
    const url = new URL(urlValue);
    return url.pathname.endsWith("/");
  } catch {
    return urlValue.endsWith("/");
  }
}

function pathOf(urlValue) {
  try {
    return new URL(urlValue).pathname;
  } catch {
    return urlValue;
  }
}

async function main() {
  let indexFiles;

  try {
    indexFiles = await walk(DIST_DIR);
  } catch (error) {
    console.error(`SEO verify failed: cannot read dist directory at ${DIST_DIR}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const errors = [];
  let canonicalCount = 0;
  let hreflangCount = 0;
  let xDefaultCount = 0;

  for (const filePath of indexFiles) {
    const html = await readFile(filePath, "utf8");

    const canonicalHref = extractFirstCanonicalHref(html);
    if (!canonicalHref) {
      errors.push(`${filePath}: missing canonical link`);
    } else {
      canonicalCount += 1;
      if (!endsWithSlash(canonicalHref)) {
        errors.push(`${filePath}: canonical does not end with slash -> ${canonicalHref}`);
      }
    }

    const alternates = extractAlternateLinks(html);
    hreflangCount += alternates.length;

    for (const alt of alternates) {
      if (!endsWithSlash(alt.href)) {
        errors.push(
          `${filePath}: hreflang=${alt.hreflang} does not end with slash -> ${alt.href}`
        );
      }

      if (alt.hreflang === "x-default") {
        xDefaultCount += 1;
        if (pathOf(alt.href) !== "/en/") {
          errors.push(`${filePath}: x-default must point to /en/ -> ${alt.href}`);
        }
      }
    }
  }

  console.log(`SEO verification scanned ${indexFiles.length} files`);
  console.log(`Canonical links: ${canonicalCount}`);
  console.log(`Hreflang links: ${hreflangCount}`);
  console.log(`x-default links: ${xDefaultCount}`);

  if (errors.length > 0) {
    console.error(`\nSEO verification failed with ${errors.length} issue(s):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("\nSEO verification passed.");
}

main();
