import { test, expect } from "../fixtures/pageFixtures";
import { RandomDataUtil } from "../utils/randomDataGenerator";

test.beforeEach(async ({ page, homePage, config }) => {
  // Step 1: Navigate to base URL and verify home page loads
  await page.goto(config.appUrl);
  await expect(page).toHaveURL(config.appUrl);
  expect(await homePage.isHomePageExists()).toBeTruthy();
});

test("User registration, authentication, product selection, add to cart, and checkout",{ tag: ["@end-to-end", "@regression"] },
async ({
    page,
    homePage,
    registerPage,
    loginPage,
    searchResultsPage,
    productPage,
    logoutPage,
    myAccountPage,
    config,
  }) => {
    const userEmail = RandomDataUtil.getEmail();
    const userPassword = RandomDataUtil.getPassword();

    // Step 2: Open My Account menu and navigate to Registration page
    await homePage.clickMyAccount();
    await homePage.clickRegisterLink();
    await expect(page).toHaveURL(/register/);
    expect(await registerPage.isRegisterPageExists()).toBeTruthy();

    // Submit registration form
    await registerPage.completeRegistration({
      firstName: RandomDataUtil.getFirstName(),
      lastName: RandomDataUtil.getLastName(),
      email: userEmail,
      telephone: RandomDataUtil.getTelephone(),
      password: userPassword,
      confirmPassword: userPassword,
    });

    // Step 3: Verify successful registration confirmation message
    const registrationStatus = await registerPage.getMessageConfirmation();
    expect(registrationStatus).toContain("Your Account Has Been Created!");

    // Step 4: Perform logout
    await myAccountPage.clickLogout();
    await logoutPage.clickContinue();

    // Step 5: Perform login
    await homePage.clickMyAccount();
    await homePage.clickLoginLink();
    await expect(page).toHaveURL(/login/);
    await loginPage.login({ email: userEmail, password: userPassword });
    await expect(page).toHaveURL(/account/);

    // Step 6: Search and select product
    await homePage.enterProductDetails(config.productName);
    await homePage.clickSearchButton();
    expect(await searchResultsPage.isSearchResultsPageExists()).toBeTruthy();
    expect(await searchResultsPage.isProductExist(config.productName)).toBeTruthy();
    expect(await searchResultsPage.selectProduct(config.productName)).toBeTruthy();

    // Step 7: Add product quantity and add to cart
    await productPage.addProductToCart(config.productQuantity);
    expect(await productPage.isConfirmationMessageVisible()).toBeTruthy();

    // Step 8: Navigate to cart and validate total
    await productPage.clickItemsToNavigateToCart();
    const shoppingCartPage = await productPage.clickViewCart();
    expect(shoppingCartPage).toBeTruthy();

    const cartTotal = await shoppingCartPage.cartTotalAMountValidation();
    expect(cartTotal).toEqual(config.totalPrice);

    // Step 9: Click checkout button
    await shoppingCartPage.clickOnCheckout();
  }
);