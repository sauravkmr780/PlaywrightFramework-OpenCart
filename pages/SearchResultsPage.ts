import { Page, Locator } from '@playwright/test';
import { ProductPage } from './ProductPage'; // Import ProductPage if needed

export class SearchResultsPage {
    private readonly page: Page;
    
    // Locators using CSS selectors
    private readonly searchPageHeader: Locator;
    private readonly searchProducts: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators with CSS selectors
        this.searchPageHeader = page.locator('#content h1');
        this.searchProducts = page.locator('h4>a');
        
    }

    /**
     * Verify if the search results page exists by checking the header text
     * @returns Promise<boolean> - true if the search results page exists
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            const headerText = await this.searchPageHeader.textContent();
            return headerText?.includes('Search -') ?? false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if a product exists in the search results by its name
     * @param productName - The name of the product to search for
     * @returns Promise<boolean> - true if the product exists
     */
    async isProductExist(productName: string): Promise<boolean> {
        try {
        const productNames:Locator[] = await this.searchProducts.all();
            for (const product of productNames) {
                const productText = await product.innerText();
                 if (productText === productName) {
                    return true;
                }
            }
        } catch (error) {
            console.log(`Error checking product existence: ${error}`);
        }
        return false;
    }

    /**
     * Select a product from the search results by its name
     * @param productName - The name of the product to select
     * @returns Promise<ProductPage> - ProductPage instance after selecting the product
     */
    async selectProduct(productName: string): Promise<ProductPage | null> {
        try {
        const productNames:Locator[] = await this.searchProducts.all();
            for (const product of productNames) {
                const productText = await product.innerText();
                 if (productText === productName) {
                    await product.click();
                    return new ProductPage(this.page);
                }
            }
            console.log(`Product not found: ${productName}`);
        } catch (error) {
            console.log(`Error selecting product: ${error}`);
        }
        return null;
    }

    /**
     * Get count of products in search results
     * @returns Promise<number> - Number of products found
     */
    async getProductCount(): Promise<number> {
        return await this.searchProducts.count();
    }
}