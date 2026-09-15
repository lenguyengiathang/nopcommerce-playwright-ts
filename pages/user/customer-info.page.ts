import { Page, Locator } from "@playwright/test";
import { MyAccountPage } from "./my-account.page";

export class CustomerInfoPage extends MyAccountPage {
  
  constructor(page: Page, pm: any) {
    super(page, pm);
    
  }
}