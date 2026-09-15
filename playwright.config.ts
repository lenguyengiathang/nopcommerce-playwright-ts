import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { timeout } from "./constants/timeout";

dotenv.config();

export default defineConfig({
  globalSetup: require.resolve("./global-setup.ts"),
  testDir: "./tests",
  timeout: timeout.testTimeout,
  expect: {
    timeout: timeout.expectTimeout,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL,
    storageState: "storageState.json",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    headless: !!process.env.CI,
    actionTimeout: timeout.actionTimeout,
    navigationTimeout: timeout.navigationTimeout,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
