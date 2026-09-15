import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/base.page';
import { CustomerInfoPage } from './customer-info.page';
import { AddressesPage } from './addresses.page';
import { ChangePasswordPage } from './change-password.page';
export class MyAccountPage extends BasePage {
  readonly customerInfoLink: Locator;
  readonly addressesLink: Locator;
  readonly changePasswordLink: Locator;


  constructor(page: Page, pm: any) {
    super(page, pm);
    this.customerInfoLink = page.locator(".block-account-navigation").getByRole('link', { name: 'Customer info' });
    this.addressesLink = page.locator(".block-account-navigation").getByRole('link', { name: 'Addresses' });
    this.changePasswordLink = page.locator(".block-account-navigation").getByRole('link', { name: 'Change password' });
  }

  async navigateToCustomerInfoPage(): Promise<CustomerInfoPage> {
    await this.customerInfoLink.click();
    return this.pm.getCustomerInfoPage();
  }

  async navigateToAddressesPage(): Promise<AddressesPage> {
    await this.addressesLink.click();
    return this.pm.getAddressesPage();
  }

  async navigateToChangePasswordPage(): Promise<ChangePasswordPage> {
    await this.changePasswordLink.click();
    return this.pm.getChangePasswordPage();
  }
  
}