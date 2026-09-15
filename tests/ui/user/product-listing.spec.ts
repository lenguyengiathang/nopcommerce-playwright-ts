import { test, expect } from "../../../fixtures/page-managers.fixture";
import { HomePage } from "../../../pages/user/home.page";
import { ProductListingPage } from "../../../pages/user/product-listing.page";

test.describe("Product Listing Tests", () => {
  let homePage: HomePage;
  let productListingPage: ProductListingPage;
  
  const searchValue: string = "Apple";

  test.beforeEach(async ({ userPageManager }) => {
    homePage = userPageManager.getHomePage();
  });

  async function openAdvancedSearch() {
    productListingPage = await homePage.clickSearchLink();
    await productListingPage.checkAdvancedSearchCheckbox();
  }

  async function expectSearchResult(searchValue: string) {
    expect(await productListingPage.isSearchResultCorrect(searchValue)).toBeTruthy();
  }

  test("Verify that the product list is displayed correctly when user performs a search", async () => {
    productListingPage = await homePage.searchProductByValue(searchValue);
    await expectSearchResult(searchValue);
  });

  test("Verify that the product list is displayed correctly when user performs an advanced search by category", async () => {
    await openAdvancedSearch();
    await productListingPage.selectCategoryDropdown("Computers >> Notebooks");
    await productListingPage.fillSearchKeywordTextbox(searchValue);
    await productListingPage.clickSearchButton();
    await expectSearchResult(searchValue);
  });

  test("Verify that the product list is displayed correctly when user performs an advanced search by manufacturer", async () => {
    await openAdvancedSearch();
    await productListingPage.selectManufacturerDropdown("Nike");
    await productListingPage.fillSearchKeywordTextbox(searchValue);
    await productListingPage.clickSearchButton();
    await productListingPage.verifyTextPresent("No products were found that matched your criteria.");
  });

  test("Verify that the product list is displayed correctly when user performs an advanced search by product description", async () => {
    await openAdvancedSearch();
    await productListingPage.checkSearchInProductDescriptionCheckbox();
    await productListingPage.fillSearchKeywordTextbox(searchValue);
    await productListingPage.clickSearchButton();
    await expectSearchResult(searchValue);
  });

  test("Verify that no product is displayed when the search value is less than 3 characters", async () => {
    productListingPage = await homePage.searchProductByValue("Ap");
    await productListingPage.verifyTextPresent("Search term minimum length is 3 characters");
  });

  test("Verify that an alert is displayed when user performs a search with an empty value", async () => {
    const alertPromise = homePage.getAlertText();
    await homePage.searchProductByValue("");
    const alertMessage = await alertPromise;
    expect(alertMessage).toBe("Please enter some search keyword");
  });
});
