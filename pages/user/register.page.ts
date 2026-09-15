import { Page, Locator } from "@playwright/test";
import { BasePage } from "../common/base.page";
import { UserData } from "../../fixtures/data.fixture";

export type RegistrationFormData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export class RegisterPage extends BasePage {
  validationSummaryErrorMessage: Locator;
  firstNameTextbox: Locator;
  lastNameTextbox: Locator;
  emailTextbox: Locator;
  passwordTextbox: Locator;
  confirmPasswordTextbox: Locator;
  registerButton: Locator;
  registrationSuccessMessage: Locator;
  dynamicErrorMessageByField: (fieldName: string) => Locator;

  constructor(page: Page, pm: any) {
    super(page, pm);
    this.validationSummaryErrorMessage = page.locator(".validation-summary-errors");
    this.firstNameTextbox = page.getByLabel("First name:");
    this.lastNameTextbox = page.getByLabel("Last name:");
    this.emailTextbox = page.getByLabel("Email:");
    this.passwordTextbox = page.getByLabel("Password:", { exact: true });
    this.confirmPasswordTextbox = page.getByLabel("Confirm password:", { exact: true });
    this.registerButton = page.getByRole("button", { name: "Register" });
    this.registrationSuccessMessage = page.locator(".result");
    this.dynamicErrorMessageByField = (fieldName: string) => page.locator(`#${fieldName.replace(/\s+/g, "")}-error`);
  }

  async fillFirstNameTextbox(firstName: string): Promise<void> {
    await this.firstNameTextbox.fill(firstName);
  }

  async fillLastNameTextbox(lastName: string): Promise<void> {
    await this.lastNameTextbox.fill(lastName);
  }

  async fillEmailTextbox(email: string): Promise<void> {
    await this.emailTextbox.fill(email);
  }

  async fillPasswordTextbox(password: string): Promise<void> {
    await this.passwordTextbox.fill(password);
  }

  async fillConfirmPasswordTextbox(confirmPassword: string): Promise<void> {
    await this.confirmPasswordTextbox.fill(confirmPassword);
  }

  async fillRegistrationForm(user: Partial<UserData>): Promise<void> {
    if (user.firstName !== undefined) {
      await this.fillFirstNameTextbox(user.firstName);
    }

    if (user.lastName !== undefined) {
      await this.fillLastNameTextbox(user.lastName);
    }

    if (user.email !== undefined) {
      await this.fillEmailTextbox(user.email);
    }

    if (user.password !== undefined) {
      await this.fillPasswordTextbox(user.password);
    }

    if (user.confirmPassword !== undefined) {
      await this.fillConfirmPasswordTextbox(user.confirmPassword);
    }
  }

  async getErrorMessageByField(fieldName: string): Promise<string> {
    return await this.dynamicErrorMessageByField(fieldName).innerText();
  }

  async clickRegisterButton(): Promise<void> {
    await this.registerButton.click();
    await this.waitForPageLoad();
  }

  async registerUser(data: RegistrationFormData): Promise<void> {
    await this.fillRegistrationForm(data);
    await this.clickRegisterButton();
  }
}
