import { Page, Locator } from '@playwright/test';
import { BasePage } from '../common/base.page';
import { ShoppingCartPage } from './shopping-cart.page';

export class WishlistPage extends BasePage {
    updateWishlistButton: Locator;
    addToCartButton: Locator;
    dynamicAddToCartCheckboxByProductName: (productName: string) => Locator;
    dynamicQuantityTextboxByProductName: (productName: string) => Locator;
    dynamicCrossIconByProductName: (productName: string) => Locator;

  constructor(page: Page, pm: any) {
    super(page, pm);
    this.updateWishlistButton = page.getByRole('button', { name: 'Update wishlist' });
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.dynamicAddToCartCheckboxByProductName = (productName: string) => page.locator(`//a[contains(.,"${productName}") and @class='product-name']/parent::td/preceding-sibling::td[@class='add-to-cart']/input`);
    this.dynamicQuantityTextboxByProductName = (productName: string) => page.locator(`//a[contains(.,"${productName}") and @class='product-name']/parent::td/following-sibling::td[@class='quantity']/input`);
    this.dynamicCrossIconByProductName = (productName: string) => page.locator(`//a[contains(.,"${productName}") and @class='product-name']/parent::td/following-sibling::td[@class='remove-from-cart']/button`);
  }

    async clickUpdateWishlistButton(): Promise<void> {
        await this.updateWishlistButton.click();
    }

    async clickAddToCartButton(): Promise<ShoppingCartPage> {
        await this.addToCartButton.click();
        return this.pm.getShoppingCartPage();
    }

    async checkAddToCartCheckboxByProductName(productName: string): Promise<void> {
        const addToCartCheckbox = this.dynamicAddToCartCheckboxByProductName(productName);
        await this.checkCheckbox(addToCartCheckbox);
    }

    async fillQuantityTextboxByProductName(productName: string, quantity: number): Promise<void> {
        const quantityTextbox = this.dynamicQuantityTextboxByProductName(productName);
        await quantityTextbox.fill(quantity.toString());
    }




  
}