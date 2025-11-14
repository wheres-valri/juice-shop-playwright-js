const { expect } = require('@playwright/test');
const selectors = require('./payment_options_selectors.js')



class PaymentOptionsPage {
    constructor (page) {
        this.page = page;
    }

    get pageTitle() {
        return this.page.locator(selectors.pageTitle);
    }

    async verifyPaymentOptionsPageLoaded() {
        await expect(this.pageTitle).toBeVisible();
        await expect(this.pageTitle).toContainText("My Payment Options");
        
    }  
     

    async clickAddNewCard(name, cardNum, expMonth, expYear){            
        await this.page.locator(selectors.addPaymentBtn).click();
        await this.page.waitForTimeout(3000);        
        await this.page.locator(selectors.nameField).fill(name);        
        await this.page.locator(selectors.cardNumField).fill(cardNum);
        await this.page.locator(selectors.expMonthField).selectOption(expMonth);
        await this.page.locator(selectors.expYearField).selectOption(expYear);        
    }

    async verifyPaymentOptionAdded(cardNumLastFour, name, expiry){
        const lastFourDig = cardNumLastFour.slice(-4);
        const addedCardRow = this.page.locator(selectors.addedCardRow).first();
        
        await expect(addedCardRow).toContainText(lastFourDig);
        await expect(addedCardRow).toContainText(name);
        await expect(addedCardRow).toContainText(expiry);

    }

    async clickSubmitPaymentOption(){
        await this.page.locator(selectors.submitBtn).click();
    }
      


}

module.exports = PaymentOptionsPage;


