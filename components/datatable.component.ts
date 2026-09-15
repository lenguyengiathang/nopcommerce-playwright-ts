import { Locator, Page } from "@playwright/test";

export class DataTableComponent {
  readonly table: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.table = page.locator("table");
    this.rows = this.table.locator("tbody tr");
  }

  async getRowCount(): Promise<number> {
    return await this.rows.count();
  }

  getRow(index: number): Locator {
    return this.rows.nth(index);
  }

  async getCellText(row: number, column: number): Promise<string> {
    return (await this.getRow(row).locator("td").nth(column).innerText()).trim();
  }

  async selectFirstRowCheckbox(): Promise<void> {
    await this.getRow(0).getByRole("checkbox").click();
  }

  async editFirstRow(): Promise<void> {
    await this.getRow(0).getByRole("link", { name: "Edit" }).click();
  }

  async editRowByText(text: string): Promise<void> {
    const row = this.rows.filter({ hasText: text });
    await row.getByRole("link", { name: "Edit" }).click();
  }

}
