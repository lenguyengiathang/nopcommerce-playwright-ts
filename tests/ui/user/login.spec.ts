import { test, expect } from "../../../fixtures";
import { LoginPage } from "../../../pages/common/login.page";
import { HomePage } from "../../../pages/user/home.page";

test.describe("Login Tests", () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ userPageManager }) => {
    homePage = userPageManager.getHomePage();
    loginPage = await homePage.clickLogInLink();
  });

  test("Verify that user cannot log in with invalid credentials", async ({ registeredUser }) => {
    await loginPage.fillEmailTextbox(registeredUser.email);
    await loginPage.fillPasswordTextbox("123456");
    await loginPage.clickLogInButton();
    const message = await loginPage.getValidationSummaryErrorMessage();
    expect(message).toContain("Login was unsuccessful. Please correct the errors and try again.");
    expect(message).toContain("The credentials provided are incorrect");
  });

  test("Verify that user cannot log in with an email not associated with an existing account", async ({ registeredUser }) => {
    await loginPage.fillEmailTextbox(`nonexistent.${registeredUser.email}`);
    await loginPage.fillPasswordTextbox(registeredUser.password);
    await loginPage.clickLogInButton();
    const message = await loginPage.getValidationSummaryErrorMessage();
    expect(message).toContain("Login was unsuccessful. Please correct the errors and try again.");
    expect(message).toContain("No customer account found");
  });

  test("Verify that user can log in with valid credentials", async ({ registeredUser }) => {
    await loginPage.fillEmailTextbox(registeredUser.email);
    await loginPage.fillPasswordTextbox(registeredUser.password);
    homePage = await loginPage.clickLogInButton();
    await expect(homePage.logOutLink).toBeVisible();
  });

  test("Verify that user can log out successfully", async ({ registeredUser }) => {
    await loginPage.fillEmailTextbox(registeredUser.email);
    await loginPage.fillPasswordTextbox(registeredUser.password);
    homePage = await loginPage.clickLogInButton();
    await homePage.clickLogOutLink();
    await expect(homePage.logOutLink).not.toBeVisible();
  });

  test("Verify that inactive user cannot log in", async ({ adminPageManager, registeredUser }) => {
    const dashboardPage = adminPageManager.getDashboardPage();
    const customersPage = await dashboardPage.navigateToPageByMenuItem("Customers", "Customers");
    await customersPage.fillEmailTextbox(registeredUser.email);
    await customersPage.clickSearchButton();
    const customerDetailsPage = await customersPage.clickEditButton();
    await customerDetailsPage.uncheckActiveCheckbox();
    await customerDetailsPage.clickSaveAndContinueEditButton();

    await loginPage.fillEmailTextbox(registeredUser.email);
    await loginPage.fillPasswordTextbox(registeredUser.password);
    await loginPage.clickLogInButton();
    const message = await loginPage.getValidationSummaryErrorMessage();
    expect(message).toContain("Login was unsuccessful. Please correct the errors and try again.");
    expect(message).toContain("Account is not active");
  });
});
