import { Locator } from '@playwright/test';

export class LocatorFactory {
  static async find(...locators: Locator[]): Promise<Locator> {
    for (const locator of locators) {
      if (await locator.isVisible().catch(() => false)) {
        return locator;
      }
    }
    throw new Error(`None of ${locators.length} locators found the element`);
  }
}