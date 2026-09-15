import dotenv from "dotenv";
dotenv.config();
import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch({
    headless: !!process.env.CI,
    slowMo: process.env.CI ? 0 : 300,
  });
  const page = await browser.newPage();
  await page.goto(`${process.env.BASE_URL}/login`);
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Email:").fill(process.env.TEST_USER_EMAIL!);
  await page.getByLabel("Password:").fill(process.env.TEST_USER_PASSWORD!);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForLoadState("networkidle");

  await page.context().storageState({ path: "storageState.json" });
  await browser.close();
}

export default globalSetup;
