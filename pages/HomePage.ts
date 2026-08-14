import { Page, Locator, expect } from "@playwright/test";

export class HomePage {
  //locators
  readonly page: Page;
  readonly accountTitleLink: Locator;
  readonly registerLink: Locator;
  readonly loginLink: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;

  //constructor
  constructor(page: Page) {
    this.page = page;
    this.accountTitleLink = page.getByTitle("My Account", { exact: true });
    this.registerLink = page.getByRole("link", { name: "Register" });
    this.loginLink = page.getByRole("link", { name: "Login" });
    this.searchBox = page.getByRole("textbox", { name: "Search" });
    this.searchButton = page.locator("button.btn.btn-default.btn-lg");
  }

  //actionable methods
  //check if homepage exist or not
  async isHomePageExists(): Promise<boolean> {
    const title: string = await this.page.title();
    if (title) {
      return true;
    }
    return false;
  }
  async clickMyAccount() {
    try {
      await this.accountTitleLink.click();
    } catch (error) {
      console.log(
        `Exception occured while clicking 'My Account link' ${error}`,
      );
      throw error;
    }
  }

  async clickRegisterLink() {
    try {
      await this.registerLink.click();
    } catch (error) {
      console.log(`Exception occured while clicking 'Register link' ${error}`);
      throw error;
    }
  }
  async clickLoginLink() {
    try {
      await this.loginLink.click();
    } catch (error) {
      console.log(`Exception occured while clicking 'Login link' ${error}`);
      throw error;
    }
  }

  async enterProductDetails(product: string) {
    try {
      await this.searchBox.fill(product);
    } catch (error) {
      console.log(
        `Exception occured while entering 'product' into textbox ${error}`,
      );
      throw error;
    }
  }

  async clickSearchButton() {
    try {
      await this.searchButton.click();
    } catch (error) {
      console.log(`Exception occured while clicking 'Search' button ${error}`);
      throw error;
    }
  }
}
