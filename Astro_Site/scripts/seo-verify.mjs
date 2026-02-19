import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const DIST_DIR = resolve(process.cwd(), "dist");
const TARGET_HREFLANGS = new Set(["en", "ar", "x-default"]);

async function collectIndexFiles(dir) {
  const entries = await readdir(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const entryStat = await stat(fullPath);

    if (entryStat.isDirectory()) {
      files.push(...(await collectIndexFiles(fullPath)));
      continue;
    }

    if (entry === "index.html") {
      files.push(fullPath);
    }
  }

  return files;
}

function extractCanonicalHref(html) {
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  return match?.[1] ?? null;
}

function extractAlternateLinks(html) {
  const links = [];
  const regex = /<link[^>]*rel=["']alternate["'][^>]*>/gi;

  for (const match of html.matchAll(regex)) {
    const tag = match[0];
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
    const hreflang = tag.match(/hreflang=["']([^"']+)["']/i)?.[1]?.toLowerCase();

    if (href && hreflang) {
      links.push({ hreflang, href });
    }
  }

  return links;
}

function endsWithSlash(urlValue) {
  try {
    return new URL(urlValue).pathname.endsWith("/");
  } catch {
    return urlValue.endsWith("/");
  }
}

function pathname(urlValue) {
  try {
    return new URL(urlValue).pathname;
  } catch {
    return urlValue;
  }
}

function fail(failures, filePath, reason, urlValue) {
  failures.push(`${filePath} | ${reason} | ${urlValue}`);
}

async function main() {
  let indexFiles;
  try {
    indexFiles = await collectIndexFiles(DIST_DIR);
  } catch (error) {
    console.error(`Unable to scan dist folder: ${DIST_DIR}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const failures = [];

  for (const filePath of indexFiles) {
    const html = await readFile(filePath, "utf8");

    const canonicalHref = extractCanonicalHref(html);
    if (!canonicalHref) {
      fail(failures, filePath, "missing canonical", "(none)");
    } else if (!endsWithSlash(canonicalHref)) {
      fail(failures, filePath, "canonical does not end with /", canonicalHref);
    }

    const alternateLinks = extractAlternateLinks(html);
    for (const link of alternateLinks) {
      if (!TARGET_HREFLANGS.has(link.hreflang)) {
        continue;
      }

      if (!endsWithSlash(link.href)) {
        fail(
          failures,
          filePath,
          `hreflang ${link.hreflang} does not end with /`,
          link.href
        );
      }

      if (link.hreflang === "x-default" && pathname(link.href) !== "/en/") {
        fail(failures, filePath, "x-default must point to /en/", link.href);
      }
    }
  }

  console.log(`Total pages scanned: ${indexFiles.length}`);

  if (failures.length > 0) {
    console.error(`Failures: ${failures.length}`);
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("Failures: 0");
  console.log("SEO verification passed.");
}

main();
