import {Page,Locator} from '@playwright/test';

export class LoginPage{
    readonly page:Page;
    readonly emailAddress :Locator;
    readonly password:Locator;
    readonly loginButton:Locator;
    readonly errorMessage:Locator;

   constructor(page:Page){
    this.page= page;
    this.emailAddress= page.getByRole('textbox', { name: 'E-Mail Address' });
    this.password= page.getByLabel('Password');
    this.loginButton=page.getByRole('button', { name: 'Login' })
    this.errorMessage =page.getByText('Warning: No match for E-Mail Address and/or Password.', { exact: true });
   }

   async enterEmailAddress(email:string){
    await this.emailAddress.fill(email);
   }
   async enterPassword(password:string){
    await this.emailAddress.fill(password);
   }
   async clickLogin(){
    await this.loginButton.click();
   }

   //complete login flow
   async login(userdata:{email:string, password:string}){
        await this.emailAddress.fill(userdata.email);
        await this.password.fill(userdata.password);
        await this.loginButton.click();
   }
   //Invalid login error message
   async errorMessagePostLogin(): Promise<string> {
    return await this.errorMessage.innerText();
   }

}