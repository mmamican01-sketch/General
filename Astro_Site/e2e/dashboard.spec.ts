/**
 * E2E tests for Dashboard: Login, Save, Edit, Create, Upload, Publish
 * Verifies that dashboard actions are reflected on the live website.
 *
 * Prerequisites: Run `npm run dev:all` (site on :4321, dashboard on :3100)
 * Run tests: npx playwright test e2e/dashboard.spec.ts
 */

import { test, expect } from "@playwright/test";

const DASH_URL = process.env.DASH_URL || "http://localhost:3100";
const SITE_URL = process.env.SITE_URL || "http://localhost:4321";
const LOGIN = { user: "admin", pass: "change-this-password" };

async function login(page: import("@playwright/test").Page) {
  await page.goto(`${DASH_URL}/login`);
  await page.getByPlaceholder("Username").fill(LOGIN.user);
  await page.getByPlaceholder("Password").fill(LOGIN.pass);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL((u) => !u.pathname.includes("login"), { timeout: 10000 });
}

test.describe("Dashboard E2E", () => {
  test("Login: Sign in with valid credentials", async ({ page }) => {
    await page.goto(`${DASH_URL}/login`);
    await page.getByPlaceholder("Username").fill(LOGIN.user);
    await page.getByPlaceholder("Password").fill(LOGIN.pass);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL((u) => !u.pathname.includes("login"), { timeout: 10000 });
    await expect(page.getByRole("heading", { name: "AFGT Dashboard" })).toBeVisible({ timeout: 5000 });
  });

  test("Login: Reject invalid credentials", async ({ page }) => {
    await page.goto(`${DASH_URL}/login`);
    await page.getByPlaceholder("Username").fill("wrong");
    await page.getByPlaceholder("Password").fill("wrong");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText("Invalid username or password")).toBeVisible({ timeout: 5000 });
  });

  test("Edit navigation: Pages list → Edit index → back", async ({ page }) => {
    await login(page);
    await page.goto(`${DASH_URL}/pages`);
    const indexRow = page.locator("li").filter({ hasText: /index|Homepage/ }).first();
    await expect(indexRow.getByRole("link", { name: "Edit" })).toBeVisible();
    await indexRow.getByRole("link", { name: "Edit" }).click();
    await expect(page).toHaveURL(/\/pages\/index/);
    await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
    await page.getByRole("link", { name: /back/i }).first().click();
    await expect(page).toHaveURL(/\/pages$/);
  });

  test("Save Page (Publish): Edit hero-link-label, save, verify on website", async ({ page }) => {
    await login(page);
    const uniqueLabel = `E2E Test ${Date.now()}`;

    await page.goto(`${DASH_URL}/pages/index`);
    await page.waitForSelector('textarea, input', { timeout: 10000 });

    const heroLinkLabel = page.locator(".card").filter({ has: page.locator('label:has-text("Hero link label")') }).locator("textarea, input").first();
    await heroLinkLabel.fill(uniqueLabel);

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText(/saved/i)).toBeVisible({ timeout: 20000 });

    await page.goto(`${SITE_URL}/en/`);
    await expect(page.getByRole("link", { name: uniqueLabel })).toBeVisible({ timeout: 10000 });

    await page.goto(`${DASH_URL}/pages/index`);
    await heroLinkLabel.fill("Who we are");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText(/saved/i)).toBeVisible({ timeout: 20000 });
  });

  test("Save Global: Open globals editor, save if slots exist", async ({ page }) => {
    await login(page);
    await page.goto(`${DASH_URL}/globals/header`);
    await expect(page.getByText(/slots|loading|value/i)).toBeVisible({ timeout: 10000 });

    const saveBtn = page.getByRole("button", { name: "Save" });
    const textarea = page.locator("textarea").first();
    if (await textarea.isVisible() && await saveBtn.isVisible()) {
      const original = await textarea.inputValue();
      await textarea.fill(original ? `${original} ` : `E2E-${Date.now()}`);
      await saveBtn.click();
      await expect(page.getByText(/saved/i)).toBeVisible({ timeout: 10000 });
      await textarea.fill(original);
      await saveBtn.click();
      await expect(page.getByText(/saved/i)).toBeVisible({ timeout: 10000 });
    }
    await page.goto(`${SITE_URL}/en/`);
    await expect(page.locator("header, nav, [role='banner']").first()).toBeVisible({ timeout: 5000 });
  });

  test("Save Collection: Edit product title, save, verify on website", async ({ page }) => {
    await login(page);
    const uniqueTitle = `Sugar E2E ${Date.now()}`;

    await page.goto(`${DASH_URL}/collections/products/sugar`);
    await page.waitForSelector('input, textarea', { timeout: 10000 });

    const titleInput = page.locator(".card").filter({ has: page.locator('label:has-text("Title")') }).locator("input, textarea").first();
    await titleInput.fill(uniqueTitle);

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText(/saved/i)).toBeVisible({ timeout: 20000 });

    await page.goto(`${SITE_URL}/en/products/sugar`);
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10000 });

    await page.goto(`${DASH_URL}/collections/products/sugar`);
    await titleInput.fill("Sugar");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText(/saved/i)).toBeVisible({ timeout: 20000 });
  });

  test("Create Page: Create new page, verify in list", async ({ page }) => {
    await login(page);
    const key = `e2e-test-${Date.now()}`;

    await page.goto(`${DASH_URL}/pages`);
    await page.getByPlaceholder(/new page key/i).fill(key);
    await page.getByRole("button", { name: "Create" }).click();

    await expect(page.locator(`strong:has-text("${key}")`)).toBeVisible({ timeout: 5000 });
  });

  test("Upload Media: Upload image, verify in list", async ({ page }) => {
    await login(page);
    await page.goto(`${DASH_URL}/media`);

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "e2e-test.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64"
      ),
    });

    await expect(page.getByText(/Uploaded:|e2e-test/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("Copy path (Media): Click Copy path, verify feedback", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await login(page);
    await page.goto(`${DASH_URL}/media`);

    const copyBtn = page.getByRole("button", { name: "Copy path" }).first();
    if (!(await copyBtn.isVisible())) {
      await page.locator('input[type="file"]').setInputFiles({
        name: "e2e-copy-test.png",
        mimeType: "image/png",
        buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64"),
      });
      await page.waitForSelector('button:has-text("Copy path")', { timeout: 5000 });
    }
    await page.getByRole("button", { name: "Copy path" }).first().click();
    await expect(page.getByText(/Copied:/i)).toBeVisible({ timeout: 5000 });
  });

  test("Page editor tabs: Content, SEO, Media", async ({ page }) => {
    await login(page);
    await page.goto(`${DASH_URL}/pages/index`);
    await page.waitForSelector('button:has-text("Save")', { timeout: 10000 });

    await page.getByRole("tab", { name: "Content" }).click();
    await expect(page.locator('label:has-text("Hero link label")')).toBeVisible();

    await page.getByRole("tab", { name: "SEO" }).click();
    await expect(page.getByLabel(/meta title/i).or(page.locator('label:has-text("Meta Title")'))).toBeVisible();

    await page.getByRole("tab", { name: "Media" }).click();
    await expect(page.locator(".card").filter({ has: page.locator('label:has-text("Section 2")') })).toBeVisible();
  });

  test("Collections: Navigate to products, edit sugar", async ({ page }) => {
    await login(page);
    await page.goto(`${DASH_URL}/collections`);
    await page.getByRole("link", { name: /products/i }).first().click();
    await expect(page).toHaveURL(/\/collections\/products/);

    const sugarRow = page.locator("li").filter({ hasText: "sugar" }).first();
    await sugarRow.getByRole("link", { name: "Edit" }).click();
    await expect(page).toHaveURL(/\/collections\/products\/sugar/);
    await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
  });

  test("Globals: Navigate to header and footer", async ({ page }) => {
    await login(page);
    await page.goto(`${DASH_URL}/globals`);
    await page.getByRole("link", { name: /header/i }).first().click();
    await expect(page).toHaveURL(/\/globals\/header/);
    await page.getByRole("link", { name: /back/i }).click();
    await page.getByRole("link", { name: /footer/i }).first().click();
    await expect(page).toHaveURL(/\/globals\/footer/);
  });

  test("Site preview: Open in site link works", async ({ page }) => {
    await login(page);
    await page.goto(`${DASH_URL}/pages/index`);
    await page.waitForSelector('a:has-text("Open in site")', { timeout: 10000 });

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "Open in site" }).click(),
    ]);
    await expect(popup).toHaveURL(new RegExp(SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await expect(popup.locator("main").first()).toBeVisible({ timeout: 5000 });
    await popup.close();
  });
});
