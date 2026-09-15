import { Page, Locator } from "@playwright/test";
import { BasePage } from "../common/base.page";
import { PageManager } from "../common/page-manager";
import { CustomerDetailsPage } from "./customer-details.page";
import { DataTableComponent } from "../../components/datatable.component";

export class CustomerListPage extends BasePage {
  readonly table: DataTableComponent;
  readonly emailTextbox: Locator;
  readonly searchButton: Locator;
  readonly editButton: Locator;

  constructor(page: Page, pm: PageManager) {
    super(page, pm);
    this.table = new DataTableComponent(page);
    this.emailTextbox = page.getByLabel("Email");
    this.searchButton = page.getByRole("button", { name: "Search" });
    this.editButton = page.getByRole("link", { name: "Edit" });
  }

  async fillEmailTextbox(email: string): Promise<void> {
    await this.emailTextbox.fill(email);
  }

  async clickSearchButton(): Promise<void> {
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  async clickEditButton(): Promise<CustomerDetailsPage> {
    await this.table.editFirstRow();
    await this.waitForPageLoad();
    return this.pm.getCustomerDetailsPage();
  }

}
