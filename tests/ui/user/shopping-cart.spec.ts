import { test, expect } from "../../../fixtures";
import { HomePage } from "../../../pages/user/home.page";
import { ProductListingPage } from "../../../pages/user/product-listing.page";
import { loginViaApi } from "../../../utils/api-helpers";
import { ProductDetailsPage } from "../../../pages/user/product-details.page";
import { ShoppingCartPage } from "../../../pages/user/shopping-cart.page";

test.describe("Shopping Cart Tests", () => {
  let homePage: HomePage;
  let productListingPage: ProductListingPage;
  let productDetailsPage: ProductListingPage | ProductDetailsPage;
  let shoppingCartPage: ShoppingCartPage;

  const category: string = "Computers";
  const subCategory: string = "Desktops";
  const productWithOptionsTitle: string = "Build Your Own Computer";
  const productWithoutOptionsTitle: string = "Lenovo IdeaCentre";

  test.beforeAll(async ({ request, registeredUser }) => {
    await loginViaApi(request, registeredUser.email, registeredUser.password);
  });

  test.beforeEach(async ({ userPageManager }) => {
    homePage = userPageManager.getHomePage();
  });

  async function addProductToCart() {
    productListingPage = await homePage.navigateToPageByCategoryAndSubCategory(category, subCategory);
    await productListingPage.clickAddToCartButtonByProductName(productWithoutOptionsTitle);
    await productListingPage.verifySuccessMessage("The product has been added to your shopping cart");
  }

  test("Verify that user can add a product without options to the shopping cart from the product listing page", async () => {
    productListingPage = await homePage.navigateToPageByCategoryAndSubCategory(category, subCategory);
    await productListingPage.clickAddToCartButtonByProductName(productWithoutOptionsTitle);
    await productListingPage.verifySuccessMessage("The product has been added to your shopping cart");
  });

  test("Verify that user cannot add a product with options to the shopping cart from the product listing page", async () => {
    productListingPage = await homePage.navigateToPageByCategoryAndSubCategory(category, subCategory);
    productDetailsPage = await productListingPage.clickAddToCartButtonByProductName(productWithOptionsTitle);
    await productDetailsPage.verifyPageTitle(productWithOptionsTitle);
  });

  test("Verify that user can add a product without options to the shopping cart from the product details page", async () => {
    productListingPage = await homePage.navigateToPageByCategoryAndSubCategory(category, subCategory);
    productDetailsPage = await productListingPage.clickProductCardByProductName(productWithoutOptionsTitle);
    await productDetailsPage.clickAddToCartButton();
    await productDetailsPage.verifySuccessMessage("The product has been added to your shopping cart");
  });

  test("Verify that user cannot add a product with options to the shopping cart when at least one mandatory option is not selected", async () => {
    productListingPage = await homePage.navigateToPageByCategoryAndSubCategory(category, subCategory);
    productDetailsPage = await productListingPage.clickProductCardByProductName(productWithOptionsTitle);
    await productDetailsPage.clickAddToCartButton();
    await productDetailsPage.verifyErrorMessage("Please select RAM");
    await productDetailsPage.verifyErrorMessage("Please select HDD");
  });

  test("Verify that user can update the quantity of the products in the shopping cart", async () => {
    await addProductToCart();
    shoppingCartPage = await productListingPage.clickShoppingCartLink();
    shoppingCartPage.fillQuantityTextboxByProductName(productWithoutOptionsTitle, 10);
  });

  test("Verify that user can remove a product from the shopping cart", async () => {
    await addProductToCart();
    shoppingCartPage = await productListingPage.clickShoppingCartLink();
    await shoppingCartPage.clickCrossIconByProductName(productWithoutOptionsTitle);
    await expect(shoppingCartPage.dynamicQuantityTextboxByProductName(productWithoutOptionsTitle)).not.toBeVisible();
  });

  test("Verify that the subtotal and the total value of the shopping cart are displayed correctly", async () => {
    productListingPage = await homePage.navigateToPageByCategoryAndSubCategory(category, subCategory);
    productDetailsPage = await productListingPage.clickProductCardByProductName(productWithOptionsTitle);
    await productDetailsPage.selectProductAttribute({
      name: "RAM",
      value: "2 GB",
      type: "dropdown",
    });
    await productDetailsPage.selectProductAttribute({
      name: "HDD",
      value: "320 GB",
      type: "radio",
    });
    const firstProductPrice = await productDetailsPage.getProductCurrentPrice();
    const firstProductQuantity = await productDetailsPage.getProductQuantity();
    productDetailsPage.clickAddToCartButton();

    productListingPage = await homePage.navigateToPageByCategoryAndSubCategory(category, subCategory);
    productDetailsPage = await productListingPage.clickProductCardByProductName(productWithoutOptionsTitle);
    await productDetailsPage.fillQuantityTextbox("2");
    const secondProductPrice = await productDetailsPage.getProductCurrentPrice();
    const secondProductQuantity = await productDetailsPage.getProductQuantity();
    productDetailsPage.clickAddToCartButton();

    shoppingCartPage = await productDetailsPage.clickShoppingCartLink();
    const subtotal = await shoppingCartPage.getSubtotalValue();
    expect(subtotal).toBe(firstProductPrice * firstProductQuantity + secondProductPrice * secondProductQuantity);
    const shipping = await shoppingCartPage.getShippingValue();
    const tax = await shoppingCartPage.getTaxValue();
    const discount = await shoppingCartPage.getDiscountValue();
    const total = await shoppingCartPage.getTotalValue();
    expect(total).toBe((subtotal + shipping + tax - discount).toFixed(2));
  });
});
