import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { TestConfig } from "../test.config";
import { LogoutPage } from "../pages/LogoutPage";
import { MyAccountPage } from "../pages/MyAccountPage";

let homepage: HomePage;
let loginpage: LoginPage;
let config: TestConfig;
let logoutpage: LogoutPage;
let myaccountpage: MyAccountPage;

test.beforeEach(async ({ page }) => {
  // Setup: Initialize Page Objects and Configuration
  homepage = new HomePage(page);
  loginpage = new LoginPage(page);
  config = new TestConfig();
  myaccountpage = new MyAccountPage(page);
  logoutpage = new LogoutPage(page);
  // Setup: Navigate to base URL and verify home page
  await page.goto(config.appUrl);
  expect(await homepage.isHomePageExists()).toBeTruthy();
});

test.afterEach(async ({ page }) => {
  // Teardown: Close browser page
  await page.close();
});

test("User Logout test",{ tag: ["@master", "@regression"] },async ({ page }) => {
    // Step 1: Open My Account dropdown and navigate to Login page
    await homepage.clickMyAccount();
    await homepage.clickLoginLink();
    await expect(page).toHaveURL(/login/);

    // Step 2: Fill in user valid credentials and submit login form
    await loginpage.login({ email: config.email, password: config.password });

    // Step 3: Verify redirection to user account page on successful login
    await expect(page).toHaveURL(/account/);

    //step 4 click accout and logout link
    await myaccountpage.clickLogout();

    //step 5 click continue button and land into homepage
    await logoutpage.clickContinue();
  },
);
