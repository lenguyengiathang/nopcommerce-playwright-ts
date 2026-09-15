import { test as base } from "./contexts.fixture";
import { PageManager } from "../pages/common/page-manager";

type PageManagerFixtures = {
  adminPageManager: PageManager;
  userPageManager: PageManager;
};

export const test = base.extend<PageManagerFixtures>({
  adminPageManager: async ({ adminPage }, use) => {
    const pageManager = new PageManager(adminPage);
    await adminPage.goto("/admin");
    await pageManager.getLoginPage().logInAsAdmin();
    await use(pageManager);
  },

  userPageManager: async ({ userPage }, use) => {
    const pageManager = new PageManager(userPage);
    await userPage.goto("/");
    await use(pageManager);
  },
});

export { expect } from "@playwright/test";