import { Page, Locator } from "@playwright/test";
import { BasePage } from "../common/base.page";
import { ProductDetailsPage } from "./product-details.page";

export class ProductListingPage extends BasePage {
  searchKeywordTextbox: Locator;
  advancedSearchCheckbox: Locator;
  categoryDropdown: Locator;
  manufacturerDropdown: Locator;
  searchInProductDescriptionCheckbox: Locator;
  searchButton: Locator;
  dynamicProductCardByProductName: (productName: string) => Locator;
  dynamicAddToCartButtonByProductName: (productName: string) => Locator;
  dynamicAddToCompareListButtonByProductName: (productName: string) => Locator;
  dynamicAddToWishlistButtonByProductName: (productName: string) => Locator;

  constructor(page: Page, pm: any) {
    super(page, pm);
    this.searchKeywordTextbox = page.getByLabel("Search keyword");
    this.advancedSearchCheckbox = page.getByLabel("Advanced search");
    this.categoryDropdown = page.getByLabel("Category:");
    this.manufacturerDropdown = page.getByLabel("Manufacturer:");
    this.searchInProductDescriptionCheckbox = page.getByLabel("Search in product descriptions");
    this.searchButton = page.locator(".search-button");
    this.dynamicProductCardByProductName = (productName: string) =>
      page.getByRole("link", {
        name: productName,
        exact: true,
      });
    this.dynamicAddToCartButtonByProductName = (productName: string) =>
      page
        .locator(".product-item")
        .filter({ has: page.locator("h2", { hasText: productName }) })
        .getByRole("button", { name: "Add to cart" });
    this.dynamicAddToCompareListButtonByProductName = (productName: string) =>
      page
        .locator(".product-item")
        .filter({ has: page.locator("h2", { hasText: productName }) })
        .getByRole("button", { name: "Add to compare list" });
    this.dynamicAddToWishlistButtonByProductName = (productName: string) =>
      page
        .locator(".product-item")
        .filter({ has: page.locator("h2", { hasText: productName }) })
        .getByRole("button", { name: "Add to wishlist" });
  }

  async fillSearchKeywordTextbox(searchValue: string) {
    await this.searchKeywordTextbox.fill(searchValue);
  }

  async checkAdvancedSearchCheckbox(): Promise<void> {
    await this.checkCheckbox(this.advancedSearchCheckbox);
  }

  async selectCategoryDropdown(category: string): Promise<void> {
    await this.categoryDropdown.selectOption({ label: category });
  }

  async selectManufacturerDropdown(manufacturer: string): Promise<void> {
    await this.manufacturerDropdown.selectOption({ label: manufacturer });
  }

  async checkSearchInProductDescriptionCheckbox(): Promise<void> {
    await this.checkCheckbox(this.searchInProductDescriptionCheckbox);
  }

  async clickSearchButton(): Promise<void> {
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  async clickProductCardByProductName(productName: string): Promise<ProductDetailsPage> {
    await this.dynamicProductCardByProductName(productName).click();
    await this.waitForPageLoad();
    return this.pm.getProductDetailsPage();
  }

  async clickAddToCartButtonByProductName(productName: string): Promise<this | ProductDetailsPage> {
    const currentUrl = this.page.url();
    await this.dynamicAddToCartButtonByProductName(productName).click();
    await this.waitForPageLoad();

    if (this.page.url() !== currentUrl) {
      return this.pm.getProductDetailsPage();
    }

    return this;
  }

  async clickAddToCompareListButtonByProductName(productName: string): Promise<void> {
    await this.dynamicAddToCompareListButtonByProductName(productName).click();
  }

  async clickAddToWishlistButtonByProductName(productName: string): Promise<this | ProductDetailsPage> {
    await this.dynamicAddToWishlistButtonByProductName(productName).click();

    const pathname = new URL(this.page.url()).pathname;

    if (
      pathname.includes(
        productName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-"),
      )
    ) {
      return this.pm.getProductDetailsPage();
    }
    return this;
  }

  async isSearchResultCorrect(searchValue: string): Promise<boolean> {
    const productDetailsPage = this.pm.getProductDetailsPage();

    if (await this.searchInProductDescriptionCheckbox.isChecked()) {
      const products = await this.getNumberOfElements(this.productTitle);

      for (let i = 0; i < products; i++) {
        await this.productTitle.nth(i).click();
        await this.waitForPageLoad();

        const description = await productDetailsPage.getProductDescription();

        if (!description.toLowerCase().includes(searchValue.toLowerCase())) {
          return false;
        }

        await this.page.goBack();
        await this.waitForPageLoad();
      }

      return true;
    }

    const productTitles = await this.getElementsInnerTexts(this.productTitle);

    return productTitles.every((title) => title.toLowerCase().includes(searchValue.toLowerCase()));
  }
}
