import { Page, Locator } from "@playwright/test";
import { MyAccountPage } from "./my-account.page";

export class ChangePasswordPage extends MyAccountPage {
  oldPasswordTextbox: Locator;
  newPasswordTextbox: Locator;
  confirmPasswordTextbox: Locator;
  changePasswordButton: Locator;

  constructor(page: Page, pm: any) {
    super(page, pm);
    this.oldPasswordTextbox = page.getByLabel("Old password");
    this.newPasswordTextbox = page.getByLabel("New password");
    this.confirmPasswordTextbox = page.getByLabel("Confirm password");
    this.changePasswordButton = page.getByRole("button", { name: "Change password" });  
  }

  async fillOldPasswordTextbox(oldPassword: string): Promise<void> {
    await this.oldPasswordTextbox.fill(oldPassword);
  }

  async fillNewPasswordTextbox(newPassword: string): Promise<void> {
    await this.newPasswordTextbox.fill(newPassword);
  }

  async fillConfirmPasswordTextbox(confirmPassword: string): Promise<void> {
    await this.confirmPasswordTextbox.fill(confirmPassword);
  }

  async clickChangePasswordButton(): Promise<void> {
    await this.changePasswordButton.click();
  } 

}