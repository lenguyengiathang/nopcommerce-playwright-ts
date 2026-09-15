import { test, expect } from "../../../fixtures";
import { ProductInformationPage } from "../../../pages/admin/product-information.page";
import { ProductListPage } from "../../../pages/admin/product-list.page";
import { HomePage } from "../../../pages/user/home.page";
import { getRandomNumberInRange } from "../../../utils/fake-data-helpers";

test.describe("Products Test", () => {
  let productsPage: ProductListPage;
  let productInformationPage: ProductInformationPage;
  let homePage: HomePage;

  const category: string = "Computers";
  const subCategory: string = "Desktops";
  const basicProductName: string = "Test Basic Product " + getRandomNumberInRange(100, 999);
  const advancedProductName: string = "Test Advanced Product " + getRandomNumberInRange(100, 999);

  test.beforeEach(async ({ adminPageManager }) => {
    productsPage = await adminPageManager.getDashboardPage().navigateToPageByMenuItem(category, subCategory);
  });

  test.afterEach(async () => {
    productsPage.refreshCurrentPage();
  });

  test('Verify that user can add a product in "Basic" mode', async () => {
    productInformationPage = await productsPage.clickAddNewButton();
    await productInformationPage.clickModeToggleButton("Basic");
    await productInformationPage.fillProductNameTextbox(basicProductName);
    productsPage = await productInformationPage.clickSaveButton();
    await productsPage.verifySuccessMessage("The new product has been added successfully.");
    await productsPage.searchProductByName(basicProductName);
    const actualProductName = await productsPage.getProductAttributeByColumnName("Product name");
    await expect(actualProductName).toBe(basicProductName);
  });

  test('Verify that user can add a product in "Advanced" mode', async () => {
    productInformationPage = await productsPage.clickAddNewButton();
    await productInformationPage.clickModeToggleButton("Advanced");
    await productInformationPage.fillProductNameTextbox(advancedProductName);
    productsPage = await productInformationPage.clickSaveButton();
    await productsPage.verifySuccessMessage("The new product has been added successfully.");
    await productsPage.searchProductByName(advancedProductName);
    const actualProductName = await productsPage.getProductAttributeByColumnName("Product name");
    await expect(actualProductName).toBe(advancedProductName);
  });

  test('Verify that the product is displayed on the home page when the "Show on home page" checkbox is selected', async () => {
    await productsPage.searchProductByName(advancedProductName);
    productInformationPage = await productsPage.clickEditButton();
    await productInformationPage.checkShowOnHomePageCheckbox();
    productsPage = await productInformationPage.clickSaveButton();
    homePage = await productsPage.switchToPublicStore();
    await homePage.verifyTextPresent(advancedProductName);
  });
});
