import { Page, Locator, expect } from "@playwright/test";
import type { ProductListPage } from "../admin/product-list.page";
import { HomePage } from "../user/home.page";
import { DashboardPage } from "../admin/dashboard.page";
import { RegisterPage } from "../user/register.page";
import { LoginPage } from "./login.page";
import { ProductListingPage } from "../user/product-listing.page";
import { MyAccountPage } from "../user/my-account.page";
import { ProductDetailsPage } from "../user/product-details.page";
import { WishlistPage } from "../user/wishlist.page";
import { ShoppingCartPage } from "../user/shopping-cart.page";

export class BasePage {
  readonly page: Page;
  readonly pm: any;

  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly pageTitle: Locator;
  readonly searchBar: Locator;
  readonly loadingIndicator: Locator;

  readonly publicStoreLink: Locator;
  readonly dynamicPopUpButtonByLabel: (label: string) => Locator;
  readonly dynamicParentMenuItemByLabel: (label: string) => Locator;
  readonly dynamicChildMenuItemByLabel: (label: string) => Locator;

  readonly administrationLink: Locator;
  readonly registerLink: Locator;
  readonly logInLink: Locator;
  readonly myAccountLink: Locator;
  readonly logOutLink: Locator;
  readonly wishlistLink: Locator;
  readonly shoppingCartLink: Locator;
  readonly productTitle: Locator;
  readonly searchLink: Locator;
  readonly dynamicCategoryItemByLabel: (label: string) => Locator;
  readonly dynamicSubCategoryItemByLabel: (label: string) => Locator;

  constructor(page: Page, pm: any) {
    this.page = page;
    this.pm = pm;
    // ── Common locators ──────────────────────────────────────────────
    this.successMessage = page.locator(".alert-success>span").or(page.locator(".bar-notification.success"));
    this.errorMessage = page.locator(".bar-notification.error");
    this.pageTitle = page.locator("h1");
    this.searchBar = page.getByPlaceholder("Search store");
    this.loadingIndicator = page.locator("#ajaxBusy");

    // ── Admin common locators ────────────────────────────────────────
    this.publicStoreLink = page.getByRole("link", { name: "Public store" });
    this.dynamicPopUpButtonByLabel = (label: string) => page.getByRole("button", { name: label });
    this.dynamicParentMenuItemByLabel = (label: string) =>
      page.locator(`li.nav-item:has(> ul.nav-treeview) > a.nav-link:has(p:text-is("${label}"))`);
    this.dynamicChildMenuItemByLabel = (label: string) =>
      page.locator(`ul.nav-treeview > li.nav-item > a.nav-link:has(p:text-is("${label}"))`);

    // ── User common locators ─────────────────────────────────────────
    this.administrationLink = page.getByRole("link", { name: "Administration" });
    this.registerLink = page.getByRole("link", { name: "Register" });
    this.logInLink = page.getByRole("link", { name: "Log in" });
    this.myAccountLink = page.locator(".header-links").getByRole("link", { name: "My account" });
    this.logOutLink = page.getByRole("link", { name: "Log out" });
    this.wishlistLink = page.locator(".header-links").getByRole("link", { name: "Wishlist" });
    this.shoppingCartLink = page.locator(".header-links").getByRole("link", { name: "Shopping cart" });
    this.productTitle = page.locator(".product-title>a");
    this.searchLink = page.getByRole("link", { name: "Search", exact: true });
    this.dynamicCategoryItemByLabel = (label: string) => page.getByRole("menuitem", { name: label, exact: true });
    this.dynamicSubCategoryItemByLabel = (label: string) => page.getByRole("menuitem", { name: label, exact: true });
  }

  async navigateToUrl(url: "/login"): Promise<LoginPage>;
  async navigateToUrl(url: "/Admin/Product/List"): Promise<ProductListPage>;
  async navigateToUrl(url: string): Promise<LoginPage | ProductListPage>;
  async navigateToUrl(url: string): Promise<LoginPage | ProductListPage> {
    await this.page.goto(url);
    await this.waitForPageLoad();
    switch (url) {
      case "/login":
        return this.pm.getLoginPage();
      case "/Admin/Product/List":
        return this.pm.getProductListPage();
      default:
        throw new Error(`No page mapping found for URL: ${url}`);
    }
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.loadingIndicator.waitFor({ state: "hidden" });
  }

  async refreshCurrentPage(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  async checkCheckbox(locator: Locator): Promise<void> {
    await locator.setChecked(true);
  }

  async uncheckCheckbox(locator: Locator): Promise<void> {
    await locator.setChecked(false);
  }

  async acceptAlert(): Promise<void> {
    this.page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
    await this.waitForPageLoad();
  }

  async dismissAlert(): Promise<void> {
    this.page.on("dialog", async (dialog) => {
      await dialog.dismiss();
    });
    await this.waitForPageLoad();
  }

  async getAlertText(): Promise<string> {
    return new Promise((resolve) => {
      this.page.once("dialog", async (dialog) => {
        const message = dialog.message();
        await dialog.dismiss();
        resolve(message);
      });
    });
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async verifyTextPresent(text: string): Promise<void> {
    await expect(this.page.getByText(text)).toHaveCount(1);
  }

  async getInputValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  async getElementInnerText(locator: Locator): Promise<string> {
    return await locator.innerText();
  }

  async getElementsInnerTexts(locator: Locator): Promise<string[]> {
    return await locator.allInnerTexts();
  }

  async getElementTextContent(locator: Locator): Promise<string> {
    return (await locator.textContent()) ?? "";
  }

  async getNumberOfElements(locator: Locator): Promise<number> {
    return await locator.count();
  }

  async verifyPageTitle(title: string): Promise<void> {
    await expect(this.pageTitle).toHaveText(title);
  }

  async verifySuccessMessage(message: string): Promise<void> {
    await expect(this.successMessage).toContainText(message);
  }

  async verifyErrorMessage(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }

  // ── Admin common functions ────────────────────────────────────────

  async navigateToPageByMenuItem(parentLabel: string, childLabel: string): Promise<any> {
    await this.dynamicParentMenuItemByLabel(parentLabel).click();
    await this.dynamicChildMenuItemByLabel(childLabel).click();
    await this.waitForPageLoad();
    switch (childLabel) {
      case "Products":
        return this.pm.getProductListPage();
      case "Customers":
        return this.pm.getCustomersPage();
      default:
        throw new Error(`No page mapping found for menu item: ${childLabel}`);
    }
  }

  async switchToPublicStore(): Promise<HomePage> {
    await this.publicStoreLink.click();
    return this.pm.getHomePage();
  }

  // ── User common functions ────────────────────────────────────────

  async switchToAdminArea(): Promise<DashboardPage> {
    await this.administrationLink.click();
    await this.waitForPageLoad();
    return this.pm.getDashboardPage();
  }

  async clickRegisterLink(): Promise<RegisterPage> {
    await this.registerLink.click();
    await this.waitForPageLoad();
    return this.pm.getRegisterPage();
  }

  async clickLogInLink(): Promise<LoginPage> {
    await this.logInLink.click();
    await this.waitForPageLoad();
    return this.pm.getLoginPage();
  }

  async clickMyAccountLink(): Promise<MyAccountPage> {
    await this.myAccountLink.click();
    await this.waitForPageLoad();
    return this.pm.getMyAccountPage();
  }

  async clickLogOutLink(): Promise<HomePage> {
    await this.logOutLink.click();
    await this.waitForPageLoad();
    return this.pm.getHomePage();
  }

  async clickWishlistLink(): Promise<WishlistPage> {
    await this.wishlistLink.click();
    await this.waitForPageLoad();
    return this.pm.getWishlistPage();
  }

  async clickShoppingCartLink(): Promise<ShoppingCartPage> {
    await this.shoppingCartLink.click();
    await this.waitForPageLoad();
    return this.pm.getShoppingCartPage();
  }

  async fillSearchBar(searchValue: string): Promise<void> {
    await this.searchBar.fill(searchValue);
  }

  async searchProductByValue(searchValue: string): Promise<ProductListingPage> {
    this.fillSearchBar(searchValue);
    await this.searchBar.press("Enter");
    await this.waitForPageLoad();
    return this.pm.getProductListingPage();
  }

  async navigateToPageByCategoryAndSubCategory(
    categoryLabel: string,
    subCategoryLabel: string,
  ): Promise<ProductListingPage> {
    await this.dynamicCategoryItemByLabel(categoryLabel).click();
    await this.dynamicSubCategoryItemByLabel(subCategoryLabel).click();
    await this.waitForPageLoad();
    return this.pm.getProductListingPage();
  }

  async clickSearchLink(): Promise<ProductListingPage> {
    await this.searchLink.click();
    await this.waitForPageLoad();
    return this.pm.getProductListingPage();
  }
}
