import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { RegisterPage } from "../pages/RegistrationPage";
import { TestConfig } from "../test.config";
import { RandomDataUtil } from "../utils/randomDataGenerator";

/* test scenario to cover
Navigate to homepage url
click Register link
fill all registration details
validation successful registration post continue button click
*/

let homepage:HomePage;
let registerpage:RegisterPage;
let config:TestConfig;

test.beforeEach('Url and object setup', async ({page})=>{
  homepage = new HomePage(page);
  registerpage = new RegisterPage(page);
  config = new TestConfig();

  // Step 1: Navigate to base URL and verify home page loads
  await page.goto(config.appUrl);
  await expect(page).toHaveURL(config.appUrl);
  expect(await homepage.isHomePageExists()).toBeTruthy();

})

test.afterEach('close the page',async({page})=>{
await page.close();
})

test("User registration test", {tag: ['@master', '@sanity', '@regression']}, async ({ page}) => {

  // Step 2: Open My Account menu and navigate to Registration page
  await homepage.clickMyAccount();
  await homepage.clickRegisterLink();
  await expect(page).toHaveURL(/register/);
  expect(await registerpage.isRegisterPageExists()).toBeTruthy();

  // Step 3: Generate dynamic data and submit registration form
  /*Calling RandomDataUtil.getPassword() twice generates two different random passwords, which may cause your confirmPassword validation on the registration form to fail.
    Store the password in a variable first so both fields receive the exact same value:
  */
  const randomPassword = RandomDataUtil.getPassword();
  // submit registration form
  await registerpage.completeRegistration({
    firstName: RandomDataUtil.getFirstName(),
    lastName: RandomDataUtil.getLastName(),
    email: RandomDataUtil.getEmail(),
    telephone: RandomDataUtil.getTelephone(),
    password: randomPassword,
    confirmPassword: randomPassword,
  });

  // Step 4: Verify successful registration confirmation message
  const registrationStatus = await registerpage.getMessageConfirmation();
  expect(registrationStatus).toContain("Your Account Has Been Created!");
});
