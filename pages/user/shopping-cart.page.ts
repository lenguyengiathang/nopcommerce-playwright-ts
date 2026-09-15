import { Page, Locator } from "@playwright/test";
import { BasePage } from "../common/base.page";

export class ShoppingCartPage extends BasePage {
  readonly checkoutButton: Locator;
  readonly subtotalValue: Locator;
  readonly shippingValue: Locator;
  readonly taxValue: Locator;
  readonly discountValue: Locator;
  readonly totalValue: Locator;
  readonly dynamicQuantityTextboxByProductName: (productName: string) => Locator;
  readonly dynamicCrossIconByProductName: (productName: string) => Locator;

  constructor(page: Page, pm: any) {
    super(page, pm);
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    this.subtotalValue = page.locator(".order-subtotal .value-summary");
    this.shippingValue = page.locator(".shipping-cost .value-summary");
    this.taxValue = page.locator(".tax-value .value-summary");
    this.discountValue = page.locator(".discount-total .value-summary");
    this.totalValue = page.locator(".order-total .value-summary");
    this.dynamicQuantityTextboxByProductName = (productName: string) =>
      page
        .locator("tr")
        .filter({ has: this.page.getByRole("link", { name: productName, exact: true }) })
        .getByRole("textbox", { name: "Qty." });
    this.dynamicCrossIconByProductName = (productName: string) =>
      page
        .locator("tr")
        .filter({ has: this.page.getByRole("link", { name: productName, exact: true }) })
        .locator(".remove-btn");
  }

  async fillQuantityTextboxByProductName(productName: string, quantity: number) {
    const quantityTextbox = this.dynamicQuantityTextboxByProductName(productName);
    await quantityTextbox.fill(quantity.toString());
  }

  async clickCrossIconByProductName(productName: string) {
    const crossIcon = this.dynamicCrossIconByProductName(productName);
    await crossIcon.click();
  }

  async getSubtotalValue(): Promise<number> {
    const subtotal = await this.getElementInnerText(this.subtotalValue);
    return Number(subtotal.replace(/[$,]/g, ""));
  }

  async getShippingValue(): Promise<number> {
    const shipping = await this.getElementInnerText(this.shippingValue);
    return Number(shipping.replace(/[$,]/g, ""));
  }

  async getTaxValue(): Promise<number> {
    const tax = await this.getElementInnerText(this.taxValue);
    return Number(tax.replace(/[$,]/g, ""));
  }

  async getDiscountValue(): Promise<number> {
    const discount = await this.getElementInnerText(this.discountValue);
    return Number(discount.replace(/[$,]/g, ""));
  }

  async getTotalValue(): Promise<number> {
    const total = await this.getElementInnerText(this.totalValue);
    return Number(total.replace(/[$,]/g, ""));
  }

  async clickCheckoutButton(): Promise<void> {
    await this.checkoutButton.click();
  }

}
