import { Page, Locator } from "@playwright/test";
import { MyAccountPage } from "./my-account.page";
import { expect } from "@playwright/test";

export class AddressesPage extends MyAccountPage {
  addNewButton: Locator;
  firstNameTextbox: Locator;
  lastNameTextbox: Locator;
  emailTextbox: Locator;
  countryDropdown: Locator;
  stateProvinceDropdown: Locator;
  cityTextbox: Locator;
  address1Textbox: Locator;
  zipPostalCodeTextbox: Locator;
  phoneNumberTextbox: Locator;
  saveButton: Locator;
  dynamicAddressCardByFullName: (fullName: string) => Locator;
  dynamicEditIconByFullName: (fullName: string) => Locator;
  dynamicDeleteIconByFullName: (fullName: string) => Locator;

  constructor(page: Page, pm: any) {
    super(page, pm);
    this.addNewButton = page.getByRole("button", { name: "Add new" });
    this.firstNameTextbox = page.getByLabel("First name");
    this.lastNameTextbox = page.getByLabel("Last name");
    this.emailTextbox = page.getByLabel("Email");
    this.countryDropdown = page.getByLabel("Country");
    this.stateProvinceDropdown = page.getByLabel("State / province");
    this.cityTextbox = page.getByLabel("City");
    this.address1Textbox = page.getByLabel("Address 1");
    this.zipPostalCodeTextbox = page.getByLabel("Zip / postal code");
    this.phoneNumberTextbox = page.getByLabel("Phone number");
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.dynamicAddressCardByFullName = (fullName: string) =>
      page
        .locator(".address-item")
        .filter({ has: page.locator("h2", { hasText: fullName }) })
        .locator("ul");
    this.dynamicEditIconByFullName = (fullName: string) =>
      page
        .locator(".address-item")
        .filter({ has: page.locator("h2", { hasText: fullName }) })
        .getByRole("button", { name: "Edit" });
    this.dynamicDeleteIconByFullName = (fullName: string) =>
      page
        .locator(".address-item")
        .filter({ has: page.locator("h2", { hasText: fullName }) })
        .getByRole("button", { name: "Delete" });
  }

  async clickAddNewButton(): Promise<void> {
    await this.addNewButton.click();
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

  async selectCountryDropdown(country: string): Promise<void> {
    await this.countryDropdown.selectOption({ label: country });
  }

  async selectStateProvinceDropdown(state: string): Promise<void> {
    await this.stateProvinceDropdown.click();
    await this.stateProvinceDropdown.selectOption({ label: state });

    await this.stateProvinceDropdown.dispatchEvent("change");
  }

  async fillCityTextbox(city: string): Promise<void> {
    await this.cityTextbox.fill(city);
  }

  async fillAddress1Textbox(address1: string): Promise<void> {
    await this.address1Textbox.fill(address1);
  }

  async fillZipPostalCodeTextbox(zipPostalCode: string): Promise<void> {
    await this.zipPostalCodeTextbox.fill(zipPostalCode);
  }

  async fillPhoneNumberTextbox(phoneNumber: string): Promise<void> {
    await this.phoneNumberTextbox.fill(phoneNumber);
  }

  async clickSaveButton(): Promise<void> {
    await this.saveButton.click();
  }

  async clickEditIconByFullName(fullName: string): Promise<void> {
    const editIcon = this.dynamicEditIconByFullName(fullName);
    await editIcon.click();
  }

  async clickDeleteIconByFullName(fullName: string): Promise<void> {
    await this.acceptAlert();
    const deleteIcon = this.dynamicDeleteIconByFullName(fullName);
    await deleteIcon.click();
    await this.dynamicAddressCardByFullName(fullName).waitFor({ state: "detached" });
  }
}
