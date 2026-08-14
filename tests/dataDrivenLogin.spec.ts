import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { TestConfig } from "../test.config";
import { DataProvider } from "../utils/dataProvider";

let homepage: HomePage;
let loginpage: LoginPage;
let config: TestConfig;

const jsondata = DataProvider.getTestdataFromJson("testdata/logindata.json");
const csvUsers = DataProvider.getTestdataFromCsv('testdata/logindata.csv');


test.beforeEach(async ({ page }) => {
  // Setup: Initialize Page Objects and Configuration
  homepage = new HomePage(page);
  loginpage = new LoginPage(page);
  config = new TestConfig();

  // Setup: Navigate to base URL and verify home page
  await page.goto(config.appUrl);
  expect(await homepage.isHomePageExists()).toBeTruthy();
});


for (const data of jsondata) {
  test(`Login test Json - ${data.testname}`, {tag: ['@datadriven']}, async ({ page }) => {
    // Step 1: Open My Account dropdown and navigate to Login page
    await homepage.clickMyAccount();
    await homepage.clickLoginLink();
    await expect(page).toHaveURL(/login/);

    await loginpage.login({ email: data.email, password: data.password });
    if (data.validity === "success") {
      await expect(page).toHaveURL(/account/);
    } else {
      await expect(page).toHaveURL(/login/);
      const errorText = await loginpage.errorMessagePostLogin();
      expect(errorText.trim()).toEqual(
        "Warning: No match for E-Mail Address and/or Password.",
      );
    }
  });
}


for (const data of csvUsers) {
  test(`Login test Csv - ${data.testname}`, {tag: ['@datadriven']}, async ({ page }) => {
    // Step 1: Open My Account dropdown and navigate to Login page
    await homepage.clickMyAccount();
    await homepage.clickLoginLink();
    await expect(page).toHaveURL(/login/);

    // Step 2: Fill credentials and submit
    await loginpage.login({ email: data.email, password: data.password });

    // Step 3: Validate based on validity flag
    const isValid = data.validity?.trim().toLowerCase() === "success";

    if (isValid) {
      await expect(page).toHaveURL(/account/);
    } else {
      await expect(page).toHaveURL(/login/);
      const errorText = await loginpage.errorMessagePostLogin();
      expect(errorText).toContain(
        "Warning: No match for E-Mail Address and/or Password."
      );
    }
  });
}