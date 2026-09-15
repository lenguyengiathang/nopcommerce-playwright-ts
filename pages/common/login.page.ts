import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { DashboardPage } from '../admin/dashboard.page';
import { PageManager } from './page-manager';
import { HomePage } from '../user/home.page';

export class LoginPage extends BasePage {
    validationSummaryErrorMessage: Locator;
    emailTextbox: Locator;
    passwordTextbox: Locator;
    logInButton: Locator;

  constructor(page: Page, pm: PageManager) {
    super(page, pm);
    this.validationSummaryErrorMessage = page.locator(".validation-summary-errors");
    this.emailTextbox = page.getByLabel('Email:');
    this.passwordTextbox = page.getByLabel('Password:');
    this.logInButton = page.getByRole('button', { name: 'Log in' });
  }

  async getValidationSummaryErrorMessage(): Promise<string> {
    return await this.getElementInnerText(this.validationSummaryErrorMessage);
  }

  async fillEmailTextbox(email: string): Promise<void> {
    await this.emailTextbox.fill(email);
  }

  async fillPasswordTextbox(password: string): Promise<void> {
    await this.passwordTextbox.fill(password);
  }

  async clickLogInButton(): Promise<DashboardPage> {
    await this.logInButton.click();
    await this.waitForPageLoad();
    return this.pm.getDashboardPage();
  }

  async logInAsAdmin(): Promise<DashboardPage> {
    await this.fillEmailTextbox(process.env.ADMIN_EMAIL!);
    await this.fillPasswordTextbox(process.env.ADMIN_PASSWORD!);
    await this.clickLogInButton();
    return this.pm.getDashboardPage();
  }

  async logInAsUser(email: string, password: string): Promise<HomePage> {
    await this.fillEmailTextbox(email);
    await this.fillPasswordTextbox(password);
    await this.clickLogInButton();
    return this.pm.getHomePage();
  }
  
}