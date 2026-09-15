import { test, expect } from "../../../fixtures";
import { HomePage } from "../../../pages/user/home.page";
import { ProductDetailsPage } from "../../../pages/user/product-details.page";
import { ProductListingPage } from "../../../pages/user/product-listing.page";
import { WishlistPage } from "../../../pages/user/wishlist.page";
import { ShoppingCartPage } from "../../../pages/user/shopping-cart.page";
import { loginViaApi } from "../../../utils/api-helpers";

test.describe("Wishlist Tests", () => {
  let homePage: HomePage;
  let productListingPage: ProductListingPage;
  let productDetailsPage: ProductListingPage | ProductDetailsPage;
  let wishlistPage: WishlistPage;
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
    productListingPage = await homePage.navigateToPageByCategoryAndSubCategory(category, subCategory);
  });

  test("Verify that user can add a product without options to the wishlist from the product listing page", async () => {
    await productListingPage.clickAddToWishlistButtonByProductName(productWithoutOptionsTitle);
    await productListingPage.verifySuccessMessage("The product has been added to your wishlist");
  });

  test("Verify that user can add a product with options to the wishlist from the product listing page", async () => {
    productDetailsPage = await productListingPage.clickAddToWishlistButtonByProductName(productWithOptionsTitle);
    await productDetailsPage.verifyPageTitle(productWithOptionsTitle);
  });

  test("Verify that user can add a product without options to the wishlist from the product details page", async () => {
    productDetailsPage = await productListingPage.clickProductCardByProductName(productWithoutOptionsTitle);
    productDetailsPage.clickAddToWishlistButton();
    await productDetailsPage.verifySuccessMessage("The product has been added to your wishlist");
  });

  test("Verify that user cannot add a product with options to the shopping cart when at least one mandatory option is not selected", async () => {
    productDetailsPage = await productListingPage.clickProductCardByProductName(productWithOptionsTitle);
    await productDetailsPage.clickAddToWishlistButton();
    await productDetailsPage.verifyErrorMessage("Please select RAM");
    await productDetailsPage.verifyErrorMessage("Please select HDD");
  });

  test("Verify that user can update the quantity of the products in the wishlist", async () => {
    await productListingPage.clickAddToWishlistButtonByProductName(productWithoutOptionsTitle);
    wishlistPage = await productListingPage.clickWishlistLink();
    wishlistPage.fillQuantityTextboxByProductName(productWithoutOptionsTitle, 10);
    await wishlistPage.clickUpdateWishlistButton();
    const quantity = await wishlistPage.getElementInnerText(
      wishlistPage.dynamicQuantityTextboxByProductName(productWithoutOptionsTitle),
    );
    expect(quantity).toBe("10");
  });

  test("Verify that user can add the products from the wishlist to the shopping cart", async () => {
    await productListingPage.clickAddToWishlistButtonByProductName(productWithoutOptionsTitle);
    wishlistPage = await productListingPage.clickWishlistLink();
    await wishlistPage.checkAddToCartCheckboxByProductName(productWithoutOptionsTitle);
    shoppingCartPage = await wishlistPage.clickAddToCartButton();
    await wishlistPage.verifySuccessMessage("The product has been added to your shopping cart");
  });

  test("Verify that the products are removed from the wishlist after being added to the shopping cart", async () => {
    await productListingPage.clickAddToWishlistButtonByProductName(productWithoutOptionsTitle);
    wishlistPage = await productListingPage.clickWishlistLink();
    await wishlistPage.checkAddToCartCheckboxByProductName(productWithoutOptionsTitle);
    shoppingCartPage = await wishlistPage.clickAddToCartButton();
    wishlistPage = await shoppingCartPage.clickWishlistLink();
    await wishlistPage.verifyTextPresent("The wishlist is empty!");
  });

  test('Verify that a warning message is displayed when user clicks the "Add to cart" button without selecting any "Add to cart" checkbox', async () => {
    await productListingPage.clickAddToWishlistButtonByProductName(productWithoutOptionsTitle);
    await productListingPage.verifySuccessMessage("The product has been added to your wishlist");
    wishlistPage = await productListingPage.clickWishlistLink();
    await wishlistPage.clickAddToCartButton();
    await wishlistPage.verifyErrorMessage("No products selected to add to cart.");
  });

  test("", async () => {});
});
