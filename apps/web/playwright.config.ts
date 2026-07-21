// Purpose: Configure Playwright smoke tests for the DiscoveryOS frontend routes.

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 8_000,
  },
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },
  webServer: {
    command: "node .next/standalone/apps/web/server.js",
    env: {
      HOSTNAME: "127.0.0.1",
      PORT: "3100",
    },
    reuseExistingServer: false,
    timeout: 60_000,
    url: "http://127.0.0.1:3100",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
