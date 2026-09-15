import { Page, Locator } from "@playwright/test";
import { BasePage } from "../common/base.page";
import { ProductListPage } from "./product-list.page";

export class ProductInformationPage extends BasePage {
  saveButton: Locator;
  saveAndContinueEditButton: Locator;
  modeToggleButton: Locator;
  productNameTextbox: Locator;
  manufacturersTextbox: Locator;
  showOnHomePageCheckbox: Locator;

  constructor(page: Page, apm: any) {
    super(page, apm);
    this.saveButton = page.getByRole("button", { name: "Save", exact: true });
    this.saveAndContinueEditButton = page.getByRole("button", { name: "Save and Continue Edit" });
    this.modeToggleButton = page.locator("label[for='advanced-settings-mode']");
    this.productNameTextbox = page.getByRole("textbox", { name: "Product name", exact: true }).first();
    this.manufacturersTextbox = page.getByRole("combobox", { name: "Manufacturers" });
    this.showOnHomePageCheckbox = page.getByRole("checkbox", { name: "Show on home page" });
  }

  async clickModeToggleButton(mode: "Basic" | "Advanced"): Promise<void> {
    const isChecked = await this.modeToggleButton.isChecked();

    if (mode === "Basic" && isChecked) {
      await this.modeToggleButton.click();
    }

    if (mode === "Advanced" && !isChecked) {
      await this.modeToggleButton.click();
    }
    await this.waitForPageLoad();
  }

  async fillProductNameTextbox(productName: string): Promise<void> {
    await this.productNameTextbox.fill(productName);
  }

  async checkShowOnHomePageCheckbox(): Promise<void> {
    await this.checkCheckbox(this.showOnHomePageCheckbox);
  }

  async clickSaveButton(): Promise<ProductListPage> {
    await this.saveButton.click();
    return this.pm.productListPage();
  }
}
