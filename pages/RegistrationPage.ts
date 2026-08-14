import { Page, Locator, expect } from "@playwright/test";

export class RegisterPage {
  //locators
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly telephone: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly subscribeYes: Locator;
  readonly subscribeNo: Locator;
  readonly agreeCheck: Locator;
  readonly continueButton: Locator;
  readonly messageConfirmation : Locator;
  readonly continueButtonPostRegistration :Locator;
  //constructor
  constructor(page: Page) {
    this.page = page;
    this.firstName = page.getByRole("textbox", { name: "First Name" });
    this.lastName = page.getByRole("textbox", { name: "Last Name" });
    this.email = page.getByRole("textbox", { name: "E-Mail" });
    this.telephone = page.getByRole("textbox", { name: "Telephone" });
    this.password = page.getByLabel("Password", { exact: true });
    this.confirmPassword = page.getByLabel("Password Confirm", { exact: true });
    this.subscribeYes = page.getByLabel("Yes", { exact: true });
    this.subscribeNo = page.getByLabel("No", { exact: true });
    this.agreeCheck = page.locator('[name="agree"]');
    this.continueButton = page.locator("input.btn.btn-primary");
    this.messageConfirmation = page.getByRole('heading',{name:'Your Account Has Been Created!'});
    this.continueButtonPostRegistration = page.getByRole('link',{name:'Continue'})
  }

  //actionable methods
  //check if Register exist or not
  async isRegisterPageExists(): Promise<boolean> {
    const title: string = await this.page.title();
    if (title) {
      return true;
    }
    return false;
  }

  async enterFirstName(firstName: string) {
  await this.firstName.fill(firstName);
  }
  async enterLastName(lastName: string) {
  await this.lastName.fill(lastName);
  }
  async enterEmail(email: string) {
  await this.email.fill(email);
  }
  async enterTelephoneNumber(telephone: string) {
  await this.telephone.fill(telephone);
  }
  async enterPassword(password: string) {
  await this.password.fill(password);

  }
  async enterConfirmPassword(confirmPassword: string) {
  await this.confirmPassword.fill(confirmPassword);
  }
  async radioYes() {
  await this.subscribeYes.check();
  }
  async radioNo() {
  await this.subscribeNo.check();
  }
  async checkAgree() {
  await this.agreeCheck.check();
  }
  async clickContinue() {
  await this.continueButton.click();
  }
  async getMessageConfirmation(): Promise<string>{
    const messagePostRegistrationform = await this.messageConfirmation.innerText();
    return messagePostRegistrationform;
  }
  //Fill all details and complete registration
  async completeRegistration(userdata:{firstName: string,lastName: string,email: string,telephone: string,password: string,confirmPassword: string}){
   await this.enterFirstName(userdata.firstName);
   await this.enterLastName(userdata.lastName);
   await this.enterEmail(userdata.email);
   await this.enterTelephoneNumber(userdata.telephone);
   await this.enterPassword(userdata.password);
   await this.enterConfirmPassword(userdata.confirmPassword);
   await this.checkAgree();
   await this.clickContinue();
  }

  async clickContinuePostRegistration(){
    await this.continueButtonPostRegistration.click();
  }
}
