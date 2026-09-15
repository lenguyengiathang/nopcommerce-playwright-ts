import { test } from "../../../fixtures";
import { HomePage } from "../../../pages/user/home.page";
import { LoginPage } from "../../../pages/common/login.page";
import { ProductListingPage } from "../../../pages/user/product-listing.page";
import { ProductDetailsPage } from "../../../pages/user/product-details.page";

test.describe("Reviews Tests", () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let productListingPage: ProductListingPage;
  let productDetailsPage: ProductDetailsPage;

  const category: string = "Computers";
  const subCategory: string = "Notebooks";
  const productTitle: string = "Apple MacBook Pro";

  test("Verify that non-registered user cannot submit a review", async ({ userPageManager }) => {
    homePage = await userPageManager.getHomePage();
    productListingPage = await homePage.navigateToPageByCategoryAndSubCategory(category, subCategory);
    productDetailsPage = await productListingPage.clickProductCardByProductName(productTitle);
    await productDetailsPage.verifyTextPresent("Only registered users can write reviews");
  });

  test("Verify that registered user can submit a review", async ({ userPageManager, registeredUser }) => {
    loginPage = userPageManager.getLoginPage();
    homePage = await loginPage.logInAsUser(registeredUser.email, registeredUser.password);
    productListingPage = await homePage.navigateToPageByCategoryAndSubCategory(category, subCategory);
    productDetailsPage = await productListingPage.clickProductCardByProductName(productTitle);
    await productDetailsPage.submitReview("Great Product", "This is a great product!", 5);
    await productDetailsPage.verifySuccessMessage("Product review is successfully added.");
  });
});
