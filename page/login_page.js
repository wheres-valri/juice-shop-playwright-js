const { expect } = require('@playwright/test');
const selectors = require('./login_page_selectors.js')



class LoginPage {
    constructor (page) {
        this.page = page;
    }


    get pageTitle() {
        return this.page.locator(selectors.pageTitle);
    }

    async verifyLoginPageLoaded() {
        await expect(this.pageTitle).toBeVisible();
        await expect(this.pageTitle).toContainText("Login");
        
    }

    async createNewCustomer() {
       return this.page.locator(selectors.newCustomerLink).click();
        
    }

    get userEmail(){
        return this.page.locator(selectors.username);
    }

    get userPassword(){
        return this.page.locator(selectors.password);
    }

    get loginBtn(){
        return this.page.locator(selectors.loginBtn);
    }

    async loginCustomer(email,password){
        await this.userEmail.fill(email);
        await this.userPassword.fill(password);           
        await this.loginBtn.click();        
    }

    
}

module.exports = LoginPage;


