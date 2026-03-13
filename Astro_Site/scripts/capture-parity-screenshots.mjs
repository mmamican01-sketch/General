#!/usr/bin/env node
/**
 * Phase 6 — Visual verification: Playwright screenshot capture
 * Captures EN pages at 375/768/1440 to parity-screenshots/astro/{width}/
 * Run: npm run build && npm run capture:parity
 * Uses Playwright if available, else Puppeteer (already in project).
 */

import { spawn } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const OUT_BASE = join(ROOT, "parity-screenshots", "astro");

const PAGES = [
  "/en/",
  "/en/who-we-are",
  "/en/products",
  "/en/products/sugar",
  "/en/commodities",
  "/en/commodities/sugar",
  "/en/sustainability",
  "/en/careers",
  "/en/contact",
];

const WIDTHS = [375, 768, 1440];
const BASE_URL = "http://127.0.0.1:4173";

function waitForServer(url, maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      attempts++;
      fetch(url, { method: "HEAD" })
        .then(() => resolve())
        .catch(() => {
          if (attempts >= maxAttempts) reject(new Error("Server did not start"));
          else setTimeout(check, 500);
        });
    };
    check();
  });
}

function slugFromPath(path) {
  const s = path.replace(/^\/en\/?/, "") || "index";
  return s.replace(/\//g, "-");
}

async function captureWithPlaywright(browser) {
  for (const width of WIDTHS) {
    const outPath = join(OUT_BASE, String(width));
    mkdirSync(outPath, { recursive: true });
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const path of PAGES) {
      const slug = slugFromPath(path);
      const url = `${BASE_URL}${path}`;
      try {
        await page.goto(url, { waitUntil: "load", timeout: 15000 });
        const file = join(outPath, `${slug}.png`);
        await page.screenshot({ path: file, fullPage: false });
        console.log(`  ${width}px: ${path} -> ${file}`);
      } catch (e) {
        console.error(`  ${width}px: ${path} failed:`, e.message);
      }
    }
    await context.close();
  }
}

async function captureWithPuppeteer(browser) {
  for (const width of WIDTHS) {
    const outPath = join(OUT_BASE, String(width));
    mkdirSync(outPath, { recursive: true });
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    for (const path of PAGES) {
      const slug = slugFromPath(path);
      const url = `${BASE_URL}${path}`;
      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });
        const file = join(outPath, `${slug}.png`);
        await page.screenshot({ path: file, fullPage: false });
        console.log(`  ${width}px: ${path} -> ${file}`);
      } catch (e) {
        console.error(`  ${width}px: ${path} failed:`, e.message);
      }
    }
    await page.close();
  }
}

async function main() {
  if (!existsSync(join(DIST, "index.html"))) {
    console.error("dist/ not found. Run: npm run build");
    process.exit(1);
  }

  const serveCmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const serve = spawn(serveCmd, ["serve", "dist", "-l", "4173"], {
    cwd: ROOT,
    stdio: "pipe",
    shell: process.platform === "win32",
  });

  serve.stderr?.on("data", (d) => process.stderr.write(d));
  serve.stdout?.on("data", (d) => process.stdout.write(d));

  try {
    await waitForServer(BASE_URL);
    console.log("Server ready at", BASE_URL);
  } catch (e) {
    console.error(e.message);
    serve.kill();
    process.exit(1);
  }

  let browser;
  try {
    const pw = await import("@playwright/test");
    browser = await pw.chromium.launch({ headless: true });
    await captureWithPlaywright(browser);
  } catch {
    try {
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.default.launch({ headless: true });
      await captureWithPuppeteer(browser);
    } catch (e2) {
      console.error("Need Playwright or Puppeteer. Run: npm install -D @playwright/test && npx playwright install chromium");
      serve.kill();
      process.exit(1);
    }
  }

  if (browser) await browser.close();
  serve.kill();
  console.log("\nScreenshots saved to parity-screenshots/astro/{375,768,1440}/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
