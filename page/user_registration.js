const { expect } = require('@playwright/test');
const selectors = require('./user_registration_selectors.js')



class RegistrationPage {
    constructor (page) {
        this.page = page;
    }


    get pageTitle() {
        return this.page.locator(selectors.pageTitle);
    }

    async verifyRegistrationPageLoaded() {
        await expect(this.pageTitle).toBeVisible();        
    }

    get regNewEmail() {
       return this.page.locator(selectors.regNewEmail);        
    }

    get regPassword() {
       return this.page.locator(selectors.regPassword);        
    }

    get regRepeatPassword() {
       return this.page.locator(selectors.regRepeatPword);
    }
    
    get selectSecurityQuestion() {
       return this.page.locator(selectors.securityQuestionDropdown);
    }

    get enterSecurityAnswer() {
       return this.page.locator(selectors.securityAnswer);
    }

    get successfulRegistrationBanner(){
        return this.page.locator(selectors.successfulRegistration);
    }

    async registerNewCustomer(email,password,secQuestion,secAnswer) {
        await this.regNewEmail.fill(email);
        await this.regPassword.fill(password);
        await this.regRepeatPassword.fill(password);

        await this.selectSecurityQuestion.click();
        await this.page.getByRole('option', { name: secQuestion }).click();
        await this.enterSecurityAnswer.fill(secAnswer);   
        await this.page.locator(selectors.registerBtn).click();           
         
    }

    async goToLogin(){
        await this.page.locator(selectors.goToLoginLink).click();
    }

}

module.exports = RegistrationPage;


