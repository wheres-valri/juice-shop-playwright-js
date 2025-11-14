const { test, expect } = require('@playwright/test');
const LoginPage = require('../page/login_page.js');
const RegistrationPage = require('../page/user_registration.js');
const DashboardPage = require('../page/main_dashboard.js');
const BasketPage = require('../page/basket_page.js');
const PaymentOptionsPage = require('../page/payment_options_page.js');
const DataErasurePage = require('../page/data_erasure_page.js');


test('Test 1 - Register New User, Login and Logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registrationPage = new RegistrationPage(page);
    const dashboardPage = new DashboardPage(page);
    const accountLoginMenu = page.locator('#navbarLoginButton');

    // Step - Navigate to homepage and close all open modals
    await dashboardPage.launchURL();
    await dashboardPage.closeModals();

    // Step - Navigate to Login page
    await page.getByRole('button', { name: 'Account' }).click();
    await accountLoginMenu.click();

    //Step - From Login page, Register a new customer
    await loginPage.createNewCustomer();
    console.log("Redirecting to User Registration Page");

    // Step - Register new customer
    await registrationPage.registerNewCustomer(
        'test_user_base01@email.com',
        'NoPassword123!!!',
        'Your favorite book?',
        'Th3 Alch3mist',
    );
    await page.waitForLoadState('networkidle');
    await loginPage.verifyLoginPageLoaded();
    console.log("New user successfully created...redirecting to Login Page");

    // Step - Login
    await loginPage.loginCustomer(
        'test_user_base01@email.com',
        'NoPassword123!!!',
    );

    // Step - Verify successful login by asserting account submenus display
    const accountSubMenuItems = [
        'test_user_base01@email.com',
        'Orders & Payment',
        'Privacy & Security',
        'Logout',
    ];

    await page.waitForTimeout(1000);
    await dashboardPage.verifyAccountSubMenus(accountSubMenuItems);

    // Step - Logout and verify landing page navigation
    await dashboardPage.logoutCustomer();
    console.log("Successfully logged out");

});

test('Test 2 - Add Payment Options Flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const paymentOptionsPage = new PaymentOptionsPage(page);
    const accountLoginMenu = page.locator('#navbarLoginButton');


    await dashboardPage.launchURL();
    await dashboardPage.closeModals();

    // Step - Navigate to Login page and proceed to login
    await page.getByRole('button', { name: 'Account' }).click();
    await accountLoginMenu.click();
    console.log("Redirecting to Login Page");

    await loginPage.verifyLoginPageLoaded();
    console.log("You're now in Login Page");

    await loginPage.loginCustomer(
        'test_user_base01@email.com',
        'NoPassword123!!!',
    );

    // Step - Navigate Account submenus to add Payment Options
    await dashboardPage.goToPaymentOptions();
    await paymentOptionsPage.verifyPaymentOptionsPageLoaded();

    await paymentOptionsPage.clickAddNewCard(
        'Test User',
        '1234567891234567',
        '5',
        '2099',
    );
    await paymentOptionsPage.clickSubmitPaymentOption();
    console.log("Successfully added card");

    // Step - verify correct payment option has been added
    await paymentOptionsPage.verifyPaymentOptionAdded(
        '4567',
        'Test User',
        '5/2099',
    );
    console.log("Successfully validated card");


});

test('Test 3 - Login, clear existing orders, search product, add orders, then checkout flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registrationPage = new RegistrationPage(page);
    const dashboardPage = new DashboardPage(page);
    const accountLoginMenu = page.locator('#navbarLoginButton');


    // Step - Navigate to homepage and close all open modals
    await dashboardPage.launchURL();
    await dashboardPage.closeModals();

    // Step - Navigate to Login page, and proceed to login
    await page.getByRole('button', { name: 'Account' }).click();
    await accountLoginMenu.click();
    console.log("Redirecting to Login Page");

    await loginPage.verifyLoginPageLoaded();
    console.log("You're now in Login Page");


    await loginPage.loginCustomer(
        'test_user_base01@email.com',
        'NoPassword123!!!',
    );

    //Step - Go To Basket page and clear any existing orders 
    const basketPage = new BasketPage(page);
    await dashboardPage.goToBasket();
    await basketPage.clearBasket();


    // Step - Input keyword and search for a product
    await page.waitForLoadState('networkidle');
    await dashboardPage.searchItem("apple");

    // Step - Verify search result display count
    const count = await dashboardPage.countSearchedItem();
    console.log(`There are ${count} matches from the search`);
    await expect(count).toBe(2);

    // Step - Add searched products to basket
    await dashboardPage.addSearchedProduct();
    console.log("Successfully added products...");

    // Step - Proceed to Checkout Page
    await dashboardPage.goToBasket();

    await basketPage.verifyBasketPageLoaded();
    await page.waitForTimeout(1000);
    console.log("You're now in 'Your Basket' page");

    // Step - Verify correct products have been added
    await basketPage.verifyBasketItems("apple");
    await page.waitForTimeout(1000);
    console.log("Correct items added to cart");

    // Step - Navigate to Checkout page (ensure Checkout button is enabled)
    await basketPage.proceedToCheckout();
    await page.waitForTimeout(1000);

});

test('Test 4 - Negative Test: Duplicate user registration, account deletion and re-registration', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registrationPage = new RegistrationPage(page);
    const dashboardPage = new DashboardPage(page);
    const dataErasurePage = new DataErasurePage(page);
    const accountLoginMenu = page.locator('#navbarLoginButton');


    await dashboardPage.launchURL();
    await dashboardPage.closeModals();

    // Step - Navigate to Login page
    await page.getByRole('button', { name: 'Account' }).click();
    await accountLoginMenu.click();
    console.log("Redirecting to Login Page");

    await loginPage.verifyLoginPageLoaded();
    console.log("You're now in Login Page");


    //Step - From Login page, Register a new customer
    await loginPage.createNewCustomer();
    console.log("Redirecting to User Registration Page");

    // Step - Register new customer
    await registrationPage.registerNewCustomer(
        'test_user_dupe01@email.com',
        'NoPassword123!!!',
        'Your favorite book?',
        'Th3 Alch3mist',
    );
    await expect(page.getByText('Registration completed')).toBeVisible();
    await page.waitForLoadState('networkidle');
    console.log("New user successfully created...redirecting to Login Page");
    await loginPage.verifyLoginPageLoaded();
    console.log("You're now in Login Page");

    //Step - From Login page, re-register an existing customer
    await loginPage.createNewCustomer();
    console.log("Redirecting to User Registration Page");

    await registrationPage.registerNewCustomer(
        'test_user_dupe01@email.com',
        'NoPassword123!!!',
        'Your favorite book?',
        'Th3 Alch3mist',
    );

    // Step - Verify error message displayed
    await expect(page.getByText('Email must be unique')).toBeVisible();
    console.log("Duplicate user registration encountered");

    // Step - Go back to user Login Page
    await registrationPage.goToLogin();

    // Step - Login and Delete existing Data and go back to Homepage
    await loginPage.loginCustomer(
        'test_user_dupe01@email.com',
        'NoPassword123!!!',
    );

    await dashboardPage.goToDataErasure();
    await dataErasurePage.deleteUserData(
        'test_user_dupe01@email.com',
        'Th3 Alch3mist',
    );
    console.log("User successfully deleted")
    await dataErasurePage.goToHomepage();

    // Step - Navigate to Login page
    await page.getByRole('button', { name: 'Account' }).click();
    await accountLoginMenu.click();
    console.log("Redirecting to Login Page");

    await loginPage.verifyLoginPageLoaded();
    console.log("You're now in Login Page");

    //Step - Re-register deleted account
    await loginPage.createNewCustomer();
    console.log("Redirecting to User Registration Page");

    // Step - NOTE: Duplicate user registration encountered 
    // EXPECTED: Successful user registration of deleted account
    await registrationPage.registerNewCustomer(
        'test_user_dupe01@email.com',
        'NoPassword123!!!',
        'Your favorite book?',
        'Th3 Alch3mist',
    );
    await expect(page.getByText('Email must be unique')).toBeVisible();
    console.log("Duplicate user registration encountered");

});