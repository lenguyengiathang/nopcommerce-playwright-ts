import { test as base, BrowserContext, Page } from "@playwright/test";

type ContextFixtures = {
  adminContext: BrowserContext;
  adminPage: Page;
  userContext: BrowserContext;
  userPage: Page;
};

export const test = base.extend<ContextFixtures>({
  adminContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },

  adminPage: async ({ adminContext }, use) => {
    const page = await adminContext.newPage();
    await use(page);
  },

  userContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: undefined,
    });
    await use(context);
    await context.close();
  },

  userPage: async ({ userContext }, use) => {
    const page = await userContext.newPage();
    await use(page);
  },
});

export { expect } from "@playwright/test";
