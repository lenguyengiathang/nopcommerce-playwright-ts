import { test, expect } from "../../../fixtures";
import { AddressesPage } from "../../../pages/user/addresses.page";
import { ChangePasswordPage } from "../../../pages/user/change-password.page";
import { HomePage } from "../../../pages/user/home.page";
import { MyAccountPage } from "../../../pages/user/my-account.page";
import * as data from "../../../utils/fake-data-helpers";

test.describe("My Account Tests", () => {
  let homePage: HomePage;
  let myAccountPage: MyAccountPage;
  let addressesPage: AddressesPage;
  let changePasswordPage: ChangePasswordPage;
  let firstName: string = data.getRandomFirstName();
  let lastName: string = data.getRandomLastName();
  let email: string = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@example.com";
  let password: string = data.getRandomPassword();

  test.beforeEach(async ({ userPageManager }) => {
    homePage = await userPageManager.getHomePage();
    myAccountPage = await homePage.clickMyAccountLink();
  });

  test("Verify that user can add a new address", async () => {
    addressesPage = await myAccountPage.navigateToAddressesPage();
    await addressesPage.clickAddNewButton();
    await addressesPage.fillFirstNameTextbox(firstName);
    await addressesPage.fillLastNameTextbox(lastName);
    await addressesPage.fillEmailTextbox(email);
    await addressesPage.selectCountryDropdown("United States of America");
    await addressesPage.selectStateProvinceDropdown("California");
    await addressesPage.fillCityTextbox(data.getRandomCity());
    await addressesPage.fillAddress1Textbox(data.getRandomAddress());
    await addressesPage.fillZipPostalCodeTextbox(data.getRandomZipCode());
    await addressesPage.fillPhoneNumberTextbox(data.getRandomPhoneNumber());
    await addressesPage.clickSaveButton();
    await addressesPage.waitForPageLoad();
    await expect(addressesPage.successMessage).toHaveText("The new address has been added successfully.");
  });

  test("Verify that user can edit an address", async () => {
    addressesPage = await myAccountPage.navigateToAddressesPage();
    await addressesPage.clickEditIconByFullName(firstName + " " + lastName);
    await addressesPage.fillAddress1Textbox(data.getRandomAddress());
    await addressesPage.clickSaveButton();
    await addressesPage.waitForPageLoad();
    await expect(addressesPage.successMessage).toHaveText("The address has been updated successfully.");
  });

  test("Verify that user can delete an address", async () => {
    addressesPage = await myAccountPage.navigateToAddressesPage();
    await addressesPage.clickDeleteIconByFullName(firstName + " " + lastName);
    await addressesPage.acceptAlert();
  });

  test("Verify that user can change password", async () => {
    changePasswordPage = await myAccountPage.navigateToChangePasswordPage();
    const newPassword = data.getRandomPassword();
    await changePasswordPage.fillOldPasswordTextbox(password);
    await changePasswordPage.fillNewPasswordTextbox(newPassword);
    await changePasswordPage.fillConfirmPasswordTextbox(newPassword);
    await changePasswordPage.clickChangePasswordButton();
    await expect(changePasswordPage.successMessage).toHaveText("Password was changed");
  });
});
