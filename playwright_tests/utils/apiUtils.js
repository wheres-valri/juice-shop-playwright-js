const { expect } = require('@playwright/test')

class ApiUtils {

    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken() {
        const loginResponse = await this.apiContext.post("/rest/user/login",
            {
                data: JSON.stringify(this.loginPayLoad),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        expect(loginResponse.ok()).toBeTruthy();

        if (!loginResponse.ok()) {
            console.error('Login failed', loginResponse.status(), await loginResponse.text());
        }

        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.authentication?.token || loginResponseJson.token;
        console.log('login token:', token);

        return token;
    }

    async createBaseUser(baseUserRegPayload) {
        const baseRegResponse = await this.apiContext.post("/api/Users/",
            {
                data: JSON.stringify(baseUserRegPayload),
                headers: {
                    'Content-Type': 'application/json'
                }
            })


        if (!baseRegResponse.ok()) {
            console.error('User registration failed', baseRegResponse.status(), await baseRegResponse.text());
            return false;
        }

        const baseRegResponseBody = await baseRegResponse.json();
        console.log('User Registered:', baseRegResponseBody.data?.email || baseRegResponseBody.email);

        return true;
    }

    async getBasketId(token) {
        const basketResponse = await this.apiContext.get("/rest/basket/", {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!basketResponse.ok()) {
            console.error('Failed to get basket ID', basketResponse.status(), await basketResponse.text());
            return null;
        }

        const basketBody = await basketResponse.json();
        const basketId = basketBody.data?.id || basketBody.id;
        console.log('Basket ID is: ', basketId);

        return basketId;
    }

}

module.exports = ApiUtils;