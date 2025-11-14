const { expect } = require('@playwright/test');
const selectors = require('./data_erasure_selectors.js')



class DataErasurePage {
    constructor (page) {
        this.page = page;
    }

    get pageTitle() {
        return this.page.locator(selectors.pageTitle);
    }

    async deleteUserData(email, answer){
        await this.page.locator(selectors.confirmEmail).fill(email);
        await this.page.locator(selectors.securityAnswer).fill(answer);
        await this.page.locator(selectors.deleteUserDataBtn).click();
    }
    
    async goToHomepage(email, answer){
        await this.page.locator(selectors.goToHomeBtn).click();
    }

}

module.exports = DataErasurePage;


