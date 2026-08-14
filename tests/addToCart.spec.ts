import { test, expect ,Locator} from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { TestConfig } from "../test.config";
import {SearchResultsPage} from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';

let homepage: HomePage;
let config: TestConfig;
let searchresultpage : SearchResultsPage;
let productpage:ProductPage;

test.beforeEach(async ({ page }) => {
  // Setup: Initialize Page Objects and Configuration
  homepage = new HomePage(page);
  config = new TestConfig();
  searchresultpage = new SearchResultsPage(page);
  productpage =new ProductPage(page);

  // Setup: Navigate to base URL and verify home page
  await page.goto(config.appUrl);
  expect(await homepage.isHomePageExists()).toBeTruthy();
});

test.afterEach(async ({ page }) => {
  // Teardown: Close browser page
  await page.close();
});

test("Add product to cart test",{ tag: ["@master", "@regression"] },async ({ page }) => {
   await homepage.enterProductDetails(config.productName);
   await homepage.clickSearchButton();
   expect(searchresultpage.isSearchResultsPageExists()).toBeTruthy();
   //search product exist or not
   expect(await searchresultpage.isProductExist(config.productName)).toBeTruthy();
   expect(await searchresultpage.selectProduct(config.productName)).toBeTruthy();
   //add product quantity and add to cart
   await productpage.addProductToCart(config.productQuantity);
   expect(productpage.isConfirmationMessageVisible()).toBeTruthy();
   //Navigate to cart
   await productpage.clickItemsToNavigateToCart();
   const shoppingcartpage: ShoppingCartPage= await productpage.clickViewCart();
   expect(shoppingcartpage).toBeTruthy();
  });
