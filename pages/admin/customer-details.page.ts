import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/base.page';
import { PageManager } from '../common/page-manager';

export class CustomerDetailsPage extends BasePage {
  saveAndContinueEditButton: Locator;
  activeCheckbox: Locator;

  constructor(page: Page, pm: PageManager) {
    super(page, pm);
    this.saveAndContinueEditButton = page.getByRole('button', { name: 'Save and Continue Edit' });
    this.activeCheckbox = page.getByLabel("Active");
  }

  async clickSaveAndContinueEditButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Save and Continue Edit' }).click();
  }

  async uncheckActiveCheckbox(): Promise<void> {
    await this.uncheckCheckbox(this.activeCheckbox);
  }
  


  
}