import { defineConfig, devices } from "@playwright/test";

const DASH_URL = process.env.DASH_URL || "http://localhost:3100";
const SITE_URL = process.env.SITE_URL || "http://localhost:4321";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: DASH_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "dashboard",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: DASH_URL,
      },
    },
  ],
  timeout: 60000,
  expect: { timeout: 10000 },
  globalSetup: undefined,
  webServer: [
    { command: "npm run dev:site", url: SITE_URL, reuseExistingServer: !process.env.CI, timeout: 60000 },
    { command: "npm run dev:dash", url: DASH_URL, reuseExistingServer: !process.env.CI, timeout: 60000 },
  ],
});
