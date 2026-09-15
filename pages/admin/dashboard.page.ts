import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/base.page';

export class DashboardPage extends BasePage {

  constructor(page: Page, apm: any) {
    super(page, apm);
  }

  
}