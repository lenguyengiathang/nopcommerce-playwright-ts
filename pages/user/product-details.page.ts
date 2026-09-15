import { Page, Locator } from "@playwright/test";
import { BasePage } from "../common/base.page";

type ProductAttributeType = "radio" | "checkbox" | "dropdown";

type ProductAttribute = {
  name: string;
  value: string;
  type: ProductAttributeType;
};

export class ProductDetailsPage extends BasePage {
  readonly productCurrentPrice: Locator;
  readonly productQuantityTextbox: Locator;
  readonly addToCartButton: Locator;
  readonly addToWishlistButton: Locator;
  readonly productDescription: Locator;
  readonly reviewTitleTextbox: Locator;
  readonly reviewTextTextarea: Locator;
  readonly submitReviewButton: Locator;
  readonly dynamicRatingRadioButtonByValue: (value: number) => Locator;
  readonly dynamicAttributeRadioButtonByValue: (value: string) => Locator;
  readonly dynamicAttributeCheckboxByValue: (value: string) => Locator;
  readonly dynamicAttributeDropdownByName: (name: string) => Locator;

  constructor(page: Page, pm: any) {
    super(page, pm);
    this.productCurrentPrice = page.locator(".product-price>span");
    this.productQuantityTextbox = page.getByLabel("Enter a quantity");
    this.addToCartButton = page.getByRole("button", { name: "Add to cart" });
    this.addToWishlistButton = page.locator(".overview-buttons").getByRole("button", { name: "Add to wishlist" });
    this.productDescription = page.locator(".short-description, .full-description>p");
    this.reviewTitleTextbox = page.getByLabel("Review title");
    this.reviewTextTextarea = page.getByLabel("Review text");
    this.submitReviewButton = page.getByRole("button", { name: "Submit review" });
    this.dynamicRatingRadioButtonByValue = (rating: number) => page.locator(`#addproductrating_${rating}`);
    this.dynamicAttributeRadioButtonByValue = (value: string) => page.getByRole("radio", { name: value });

    this.dynamicAttributeCheckboxByValue = (value: string) => page.getByRole("checkbox", { name: value });

    this.dynamicAttributeDropdownByName = (name: string) => page.getByLabel(name);
  }

  async fillQuantityTextbox(quantity: string): Promise<void> {
    await this.productQuantityTextbox.fill(quantity);
  }

  async getProductQuantity(): Promise<number> {
    const quantity = await this.getInputValue(this.productQuantityTextbox);
    return Number(quantity);
  }

  async getProductCurrentPrice(): Promise<number> {
    const productCurrentPrice = await this.getElementInnerText(this.productCurrentPrice);
    return Number(productCurrentPrice.replace(/[$,]/g, ""));
  }

  async clickAddToCartButton(): Promise<void> {
    await this.addToCartButton.click();
  }

  async clickAddToWishlistButton(): Promise<void> {
    await this.addToWishlistButton.click();
  }

  async getProductDescription(): Promise<string> {
    const productDescription = (await this.getElementsInnerTexts(this.productDescription)).join(" ");
    console.log("Product description:", productDescription);
    return productDescription;
  }

  async fillReviewTitleTextbox(title: string): Promise<void> {
    await this.reviewTitleTextbox.fill(title);
  }

  async fillReviewTextTextarea(text: string): Promise<void> {
    await this.reviewTextTextarea.fill(text);
  }

  async selectRatingRadioButton(value: number): Promise<void> {
    const ratingRadioButton = this.dynamicRatingRadioButtonByValue(value);
    await ratingRadioButton.check();
  }

  async clickSubmitReviewButton(): Promise<void> {
    await this.submitReviewButton.click();
  }

  async submitReview(title: string, text: string, rating: number): Promise<void> {
    await this.fillReviewTitleTextbox(title);
    await this.fillReviewTextTextarea(text);
    await this.selectRatingRadioButton(rating);
    await this.clickSubmitReviewButton();
  }

  async selectProductAttribute(attribute: ProductAttribute): Promise<void> {
    switch (attribute.type) {
      case "radio": {
        const radioButton = this.dynamicAttributeRadioButtonByValue(attribute.value);
        await radioButton.check();
        break;
      }

      case "checkbox": {
        const checkbox = this.dynamicAttributeCheckboxByValue(attribute.value);
        await checkbox.check();
        break;
      }

      case "dropdown": {
        const dropdown = this.dynamicAttributeDropdownByName(attribute.name);
        await dropdown.selectOption({
          label: attribute.value,
        });

        break;
      }
    }
  }
}
