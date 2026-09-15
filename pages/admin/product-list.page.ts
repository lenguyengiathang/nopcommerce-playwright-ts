import { Page, Locator } from "@playwright/test";
import { BasePage } from "../common/base.page";
import { PageManager } from "../common/page-manager";
import { ProductInformationPage } from "./product-information.page";

export class ProductListPage extends BasePage {
  addNewButton: Locator;
  bulkEditProductsButton: Locator;
  downloadCatalogAsPDFButton: Locator;
  exportButton: Locator;
  importButton: Locator;
  deleteSelectedButton: Locator;

  productNameTextbox: Locator;
  searchButton: Locator;

  dynamicProductAttributeByIndex: (index: number) => Locator;
  editButton: Locator;

  private readonly columnIndex: Record<string, number> = {
    "Picture": 2,
    "Product name": 3,
    "SKU": 4,
    "Price": 5,
    "Stock quantity": 6,
    "Published": 7,
  };

  constructor(page: Page, pm: PageManager) {
    super(page, pm);
    this.addNewButton = page.getByRole("link", { name: "Add new" });
    this.bulkEditProductsButton = page.getByRole("link", { name: "Bulk edit products" });
    this.downloadCatalogAsPDFButton = page.getByRole("link", { name: "Download catalog as PDF" });
    this.exportButton = page.getByRole("link", { name: "Export" });
    this.importButton = page.getByRole("link", { name: "Import" });
    this.deleteSelectedButton = page.getByRole("link", { name: "Delete selected" });

    this.productNameTextbox = page.getByLabel("Product name");
    this.searchButton = page.getByRole("button", { name: "Search" });

    this.dynamicProductAttributeByIndex = (index: number) => page.locator(`//table/tbody/tr/td[${index}]`);
    this.editButton = page.getByRole("link", { name: "Edit", exact: true }).first();
  }

  async clickAddNewButton(): Promise<ProductInformationPage> {
    await this.addNewButton.click();
    return this.pm.productInformationPage();
  }

  async clickBulkEditProductsButton(): Promise<void> {
    await this.bulkEditProductsButton.click();
  }

  async clickDownloadCatalogAsPDFButton(): Promise<void> {
    await this.downloadCatalogAsPDFButton.click();
  }

  async clickExportButton(): Promise<void> {
    await this.exportButton.click();
  }

  async clickImportButton(): Promise<void> {
    await this.importButton.click();
  }

  async clickDeleteSelectedButton(): Promise<void> {
    await this.deleteSelectedButton.click();
  }

  async fillProductNameTextbox(productName: string): Promise<void> {
    await this.productNameTextbox.fill(productName);
  }

  async clickSearchButton(): Promise<void> {
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  async searchProductByName(productName: string): Promise<void> {
    await this.fillProductNameTextbox(productName);
    await this.clickSearchButton();
  }

  async getProductAttributeByColumnName(columnName: string): Promise<string> {
    const index = this.columnIndex[columnName];
    if (!index) throw new Error(`Column "${columnName}" not found`);
    return await this.dynamicProductAttributeByIndex(index).innerText();
  }

  async clickEditButton(): Promise<ProductInformationPage> {
    await this.editButton.click();
    return this.pm.productInformationPage();
  }
}
