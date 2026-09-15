import { test, expect } from "../../../fixtures/page-managers.fixture";
import { HomePage } from "../../../pages/user/home.page";
import { RegisterPage } from "../../../pages/user/register.page";
import { RegisterMessages } from "../../../constants/messages/register-messages";
import * as data from "../../../utils/fake-data-helpers";

test.describe("Register Test", () => {
  let homePage: HomePage;
  let registerPage: RegisterPage;
  let firstName: string = data.getRandomFirstName();
  let lastName: string = data.getRandomLastName();
  let email: string = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  let password: string = data.getRandomPassword();

  test.beforeEach(async ({ userPageManager }) => {
    homePage = userPageManager.getHomePage();
    registerPage = await homePage.clickRegisterLink();
  });

  test("Verify that user can register an account when all mandatory fields are filled with valid information", async () => {
    await registerPage.fillFirstNameTextbox(firstName);
    await registerPage.fillLastNameTextbox(lastName);
    await registerPage.fillEmailTextbox(email);
    await registerPage.fillPasswordTextbox(password);
    await registerPage.fillConfirmPasswordTextbox(password);
    await registerPage.clickRegisterButton();
    await expect(registerPage.registrationSuccessMessage).toHaveText(RegisterMessages.registrationCompleted);
  });

  test("Verify that user cannot register an account when a mandatory field is left blank", async () => {
    await registerPage.clickRegisterButton();
    await expect(registerPage.dynamicErrorMessageByField("First Name")).toHaveText(RegisterMessages.firstNameRequired);
    await expect(registerPage.dynamicErrorMessageByField("Last Name")).toHaveText(RegisterMessages.lastNameRequired);
    await expect(registerPage.dynamicErrorMessageByField("Email")).toHaveText(RegisterMessages.emailRequired);
    await expect(registerPage.dynamicErrorMessageByField("Confirm Password")).toHaveText(
      RegisterMessages.passwordRequired,
    );
  });

  test("Verify that user cannot register an account with an existing email", async () => {
    await registerPage.fillFirstNameTextbox(firstName);
    await registerPage.fillLastNameTextbox(lastName);
    await registerPage.fillEmailTextbox(process.env.ADMIN_EMAIL!);
    await registerPage.fillPasswordTextbox(password);
    await registerPage.fillConfirmPasswordTextbox(password);
    await registerPage.clickRegisterButton();
    await expect(registerPage.validationSummaryErrorMessage).toHaveText(RegisterMessages.emailAlreadyExists);
  });

  test('Verify that user cannot register an account when the "Password" and "Confirm password" values do not match', async () => {
    await registerPage.fillFirstNameTextbox(firstName);
    await registerPage.fillLastNameTextbox(lastName);
    await registerPage.fillEmailTextbox(email);
    await registerPage.fillPasswordTextbox(password);
    await registerPage.fillConfirmPasswordTextbox(`${password}1`);
    await registerPage.clickRegisterButton();
    await expect(registerPage.dynamicErrorMessageByField("Confirm Password")).toHaveText(
      RegisterMessages.passwordMismatch,
    );
  });
});
