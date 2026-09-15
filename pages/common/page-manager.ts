import { Page } from "@playwright/test";
import { LoginPage } from "./login.page";
import { DashboardPage } from "../admin/dashboard.page";
import { ProductListPage } from "../admin/product-list.page";
import { ProductInformationPage } from "../admin/product-information.page";
import { RegisterPage } from "../user/register.page";
import { HomePage } from "../user/home.page";
import { CustomerListPage } from "../admin/customer-list.page";
import { CustomerDetailsPage } from "../admin/customer-details.page";
import { ProductListingPage } from "../user/product-listing.page";
import { ProductDetailsPage } from "../user/product-details.page";
import { CustomerInfoPage } from "../user/customer-info.page";
import { AddressesPage } from "../user/addresses.page";
import { MyAccountPage } from "../user/my-account.page";
import { ChangePasswordPage } from "../user/change-password.page";
import { ShoppingCartPage } from "../user/shopping-cart.page";
import { WishlistPage } from "../user/wishlist.page";

export class PageManager {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Common pages ───────────────────────────────────────

  getLoginPage(): LoginPage {
    return new LoginPage(this.page, this);
  }

  // ── Admin pages ────────────────────────────────────────

  getDashboardPage(): DashboardPage {
    return new DashboardPage(this.page, this);
  }
  getProductListPage(): ProductListPage {
    return new ProductListPage(this.page, this);
  }
  getProductInformationPage(): ProductInformationPage {
    return new ProductInformationPage(this.page, this);
  }

  getCustomersPage(): CustomerListPage {
    return new CustomerListPage(this.page, this);
  }

  getCustomerDetailsPage(): CustomerDetailsPage {
    return new CustomerDetailsPage(this.page, this);
  }

  // ── User pages ─────────────────────────────────────────

  getHomePage(): HomePage {
    return new HomePage(this.page, this);
  }
  getRegisterPage(): RegisterPage {
    return new RegisterPage(this.page, this);
  }

  getProductListingPage(): ProductListingPage {
    return new ProductListingPage(this.page, this);
  }

  getProductDetailsPage(): ProductDetailsPage {
    return new ProductDetailsPage(this.page, this);
  }

  getWishlistPage(): WishlistPage {
    return new WishlistPage(this.page, this);
  }

  getShoppingCartPage(): ShoppingCartPage {
    return new ShoppingCartPage(this.page, this);
  }

  getMyAccountPage(): MyAccountPage {
    return new MyAccountPage(this.page, this);
  }

  getCustomerInfoPage(): CustomerInfoPage {
    return new CustomerInfoPage(this.page, this);
  }

  getAddressesPage(): AddressesPage {
    return new AddressesPage(this.page, this);
  }

  getChangePasswordPage(): ChangePasswordPage {
    return new ChangePasswordPage(this.page, this);
  }
}
