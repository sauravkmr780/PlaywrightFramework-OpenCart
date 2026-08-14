import { Page, Locator, expect } from '@playwright/test';
import { LogoutPage } from './LogoutPage'; // Import LogoutPage if needed

export class MyAccountPage {
    private readonly page: Page;
    
    // Locators using CSS selectors
    private readonly msgHeading: Locator;
    private readonly logoutlink: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators with CSS selectors
        this.msgHeading = page.getByTitle('My Account');
        this.logoutlink = page.locator('a').filter({ hasText: 'Logout' }).first();
    }

    /**
     * Verifies if My Account page is displayed
     * @returns Promise<boolean> - Returns true if heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            const isVisible = await this.msgHeading.isVisible();
            return isVisible;
        } catch (error) {
            console.log(`Error checking My Account page heading visibility: ${error}`);
            return false;
        }
    }

    /**
     * Clicks on Logout link
     * @returns Promise<LogoutPage> - Returns instance of LogoutPage
     */
    async clickLogout(): Promise<LogoutPage> {
        try {
            await this.msgHeading.click();
            await this.logoutlink.click();
            return new LogoutPage(this.page);
        } catch (error) {
            console.log(`Unable to click Logout link: ${error}`);
            throw error; // Re-throw the error to fail the test
        }
    }

    /**
     * Alternative method to return page exists using title
     * @returns Promise<boolean> - Returns true if page title matches
     */
    async getPageTitle(): Promise<string> {
        return (this.page.title());
    }

}