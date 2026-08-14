import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { RegisterPage } from "../pages/RegistrationPage";
import { TestConfig } from "../test.config";
import { RandomDataUtil } from "../utils/randomDataGenerator";
import { LoginPage } from "../pages/LoginPage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { ProductPage } from "../pages/ProductPage";
import { ShoppingCartPage } from "../pages/ShoppingCartPage";
import { LogoutPage } from "../pages/LogoutPage";
import { MyAccountPage } from "../pages/MyAccountPage";

let homepage: HomePage;
let registerpage: RegisterPage;
let config: TestConfig;
let loginpage: LoginPage;
let searchresultpage: SearchResultsPage;
let productpage: ProductPage;
let logoutpage: LogoutPage;
let myaccountpage: MyAccountPage;

test.beforeEach("Url and object setup", async ({ page }) => {
  homepage = new HomePage(page);
  registerpage = new RegisterPage(page);
  config = new TestConfig();
  loginpage = new LoginPage(page);
  searchresultpage = new SearchResultsPage(page);
  productpage = new ProductPage(page);
  logoutpage = new LogoutPage(page);
  myaccountpage = new MyAccountPage(page);

  // Step 1: Navigate to base URL and verify home page loads
  await page.goto(config.appUrl);
  await expect(page).toHaveURL(config.appUrl);
  expect(await homepage.isHomePageExists()).toBeTruthy();
});

test.afterEach(async({page})=>{
    await page.close();
})

test("User registration test, logout, Login and End to End product selection,add to cart and checkout",{ tag: ["@end-to-end", "@regression"] },async ({ page }) => {
    const userEmail = RandomDataUtil.getEmail();
    const userPassword = RandomDataUtil.getPassword();

    // Step 2: Open My Account menu and navigate to Registration page
    await homepage.clickMyAccount();
    await homepage.clickRegisterLink();
    await expect(page).toHaveURL(/register/);
    expect(await registerpage.isRegisterPageExists()).toBeTruthy();

    // submit registration form
    await registerpage.completeRegistration({
      firstName: RandomDataUtil.getFirstName(),
      lastName: RandomDataUtil.getLastName(),
      email: userEmail,
      telephone: RandomDataUtil.getTelephone(),
      password: userPassword,
      confirmPassword: userPassword,
    });

    // Step 4: Verify successful registration confirmation message
    const registrationStatus = await registerpage.getMessageConfirmation();
    expect(registrationStatus).toContain("Your Account Has Been Created!");

    //perform logout
    //step 5 click accout and logout link
    await myaccountpage.clickLogout();
    //step 6 click continue button and land into homepage
    await logoutpage.clickContinue();

    await homepage.clickMyAccount();
    await homepage.clickLoginLink();
    await expect(page).toHaveURL(/login/);
    await loginpage.login({ email: userEmail, password: userPassword });
    // Step 3: Verify redirection to user account page on successful login
    await expect(page).toHaveURL(/account/);
    await homepage.enterProductDetails(config.productName);
    await homepage.clickSearchButton();
    expect(await searchresultpage.isSearchResultsPageExists()).toBeTruthy();
    //search product exist or not
    expect(await searchresultpage.isProductExist(config.productName)).toBeTruthy();
    expect(await searchresultpage.selectProduct(config.productName)).toBeTruthy();
    //add product quantity and add to cart
    await productpage.addProductToCart(config.productQuantity);
    expect(await productpage.isConfirmationMessageVisible()).toBeTruthy();
    //Navigate to cart
    await productpage.clickItemsToNavigateToCart();
    const shoppingcartpage: ShoppingCartPage =await productpage.clickViewCart();
    expect(shoppingcartpage).toBeTruthy();
    const cartTotal= await shoppingcartpage.cartTotalAMountValidation();
    expect(cartTotal).toEqual(config.totalPrice);
    //click checkout button
    await shoppingcartpage.clickOnCheckout();

  },
);

