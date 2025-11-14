const { expect } = require('@playwright/test');
const selectors = require('./main_dashboard_selectors.js')



class DashboardPage {
    constructor (page) {
        this.page = page;
    }

    async launchURL(){
        await this.page.goto("/#/");
    }

    get pageTitle() {
        return this.page.locator(selectors.pageTitle);
    }
   
    async closeModals(){
        await this.page.getByRole('button', {name: 'Dismiss'}).click();
        await this.page.waitForTimeout(1000);
        await this.page.getByRole('button', { name: 'Close Welcome Banner' }).click();      

    }

    async verifyAccountSubMenus(accountSubmenu){
        await this.page.locator(selectors.accountBtn).click();     
        await this.page.waitForTimeout(2000);
        for (const item of accountSubmenu){
            // await expect(this.page.locator(`button[aria-label="${label}"]`).first()).toBeVisible();
           await expect(this.page.getByText(item.trim()).last()).toBeVisible();
        }
    }

    async logoutCustomer(){
        await this.page.locator(selectors.logoutBtn).click();
    }

    async searchItem(item){
        await this.page.getByLabel('Click to Search').click();        
        await this.page.locator(selectors.searchBox).fill(item);
        await this.page.locator(selectors.searchBox).press('Enter');
    }

    async countSearchedItem(){
        const product = this.page.locator(selectors.product);
        const count = await product.count();        
        return count;
    }

    async addSearchedProduct(){
        const addToBasketBtn = this.page.locator(selectors.addToBasketBtn);
        const count = await addToBasketBtn.count();

        for (let i=0; i<count; i++){
            await addToBasketBtn.nth(i).click();            
        }
    }

 async goToBasket(){
        await this.page.getByLabel('Show the shopping cart').click();                
    }

     async goToPaymentOptions(){
        await this.page.locator(selectors.accountBtn).click();    
        await this.page.locator(selectors.orderPaymentBtn).waitFor();    
        await this.page.locator(selectors.orderPaymentBtn).click();    
        await this.page.locator(selectors.paymentOptionsBtn).waitFor();       
        await this.page.locator(selectors.paymentOptionsBtn).click();             
    }

    async goToDataErasure(){
        await this.page.locator(selectors.accountBtn).click();    
        await this.page.locator(selectors.privacySecurityBtn).waitFor();    
        await this.page.locator(selectors.privacySecurityBtn).click();    
        await this.page.locator(selectors.dataErasureBtn).waitFor();       
        await this.page.locator(selectors.dataErasureBtn).click();             
    }


}

module.exports = DashboardPage;


