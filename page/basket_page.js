const { expect } = require('@playwright/test');
const selectors = require('./basket_page_selectors.js')



class BasketPage {
    constructor (page) {
        this.page = page;
    }

    get pageTitle() {
        return this.page.locator(selectors.pageTitle);
    }

    async verifyBasketPageLoaded() {
        await expect(this.pageTitle).toBeVisible();
        await expect(this.pageTitle).toContainText("Your Basket");
        
    }   

    async clearBasket() {
        const deleteIcon = this.page.locator(selectors.deleteIcon);
        let count = await deleteIcon.count();
        if (count ===0){
            console.log("Basket is Empty");
            return;
        }

        while (count > 0){
            await deleteIcon.first().click();
            await this.page.waitForTimeout(500);
            count = await deleteIcon.count();
        }
        console.log("Basket is cleared.");
        
    }  

    async verifyBasketItems(expectedProduct) {
        const productItems = this.page.locator(selectors.productItems);
        const count = await productItems.count();
        for (let i=0; i<count; i++){
            const prodText = await productItems.nth(i).textContent();
            expect(prodText.toLowerCase()).toContain(expectedProduct.toLowerCase());            
        }
        
    }  

    async proceedToCheckout(){
        const checkoutBtn = this.page.locator(selectors.checkoutBtn)
        if (await checkoutBtn.isDisabled()) {
            console.log("Checkout Button is disabled");
        }
        else{
            await expect(checkoutBtn).toBeEnabled();
            await checkoutBtn.click();
        }
         
         
    }
  

}

module.exports = BasketPage;


