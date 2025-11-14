const { test, expect, request } = require('@playwright/test');
const ApiUtils = require('./utils/apiUtils')
// NOTE: baseUserPayLoad and loginPayLoad should have the SAME email
const baseUserPayLoad = { "email": "test_user_base@email.com", "password": "NoPassword123!!!", "passwordRepeat": "NoPassword123!!!", "securityQuestion": { "id": 11, "question": "Your favorite book?", }, "securityAnswer": "Th3 Alch3mist" };
const loginPayLoad = { email: "test_user_base@email.com", password: "NoPassword123!!!" };
const addressPayLoad = { country: "Philippines", fullName: "Val Rigor", mobileNum: "1234567", zipCode: "1233", streetAddress: "Makati", city: "Makati", state: "Metro Manila" };
// NOTE: Ensure new and dupe user email values are updated and are UNIQUE when re-running test
const newUserRegistrationPayLoad = { "email": "test_user_unique01@email.com", "password": "NoPassword123!!!", "passwordRepeat": "NoPassword123!!!", "securityQuestion": { "id": 11, "question": "Your favorite book?", }, "securityAnswer": "Th3 Alch3mist" };
const dupeUserRegistrationPayLoad = { "email": "test_user_duplicate01@email.com", "password": "NoPassword123!!!", "passwordRepeat": "NoPassword123!!!", "securityQuestion": { "id": 11, "question": "Your favorite book?", }, "securityAnswer": "Th3 Alch3mist" };
let token;
let basketId;
let apiContext;

test.beforeAll(async () => {
    apiContext = await request.newContext();
    const apiUtils = new ApiUtils(apiContext, loginPayLoad);

    await apiUtils.createBaseUser(baseUserPayLoad);
    token = await apiUtils.getToken();
});

test.afterAll(async () => {
    await apiContext?.dispose();
});

test('API Test 1 - Create POST API request to register new user and validate GET response', async ({ request }) => {
    // Step - Add new user
    const postAPIResponse = await request.post('/api/Users/', {
        data: newUserRegistrationPayLoad,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    //Step - Validate status code
    expect(postAPIResponse.ok()).toBeTruthy();
    expect(postAPIResponse.status()).toBe(201);

    const postAPIResponseBody = await postAPIResponse.json();
    console.log(postAPIResponseBody);
    console.log("Successfully Registered New User");
    console.log("========================");

    const userId = postAPIResponseBody.data?.id || postAPIResponseBody.id;

    // Step - GET request to validate the user was created
    const getAPIResponse = await request.get(`/api/Users/${userId}`, {

        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    expect(getAPIResponse.ok()).toBeTruthy();
    expect(getAPIResponse.status()).toBe(200);

    const getAPIResponseBody = await getAPIResponse.json();

    console.log('======  GET response:', getAPIResponseBody);
    const userEmail = getAPIResponseBody.data?.email || getAPIResponseBody.email;
    expect(userEmail).toBe(newUserRegistrationPayLoad.email);
    console.log("========================");


});

test('API Test 2 - Create POST API request to add an order in the basket and DELETE afterwards', async ({ request }) => {
    const orderPayLoad = { ProductId: 24, BasketId: basketId, quantity: 1 };

    const postAPIResponse = await request.post('/api/BasketItems/', {
        data: orderPayLoad,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    // Step - Validate status code
    expect(postAPIResponse.ok()).toBeTruthy();
    expect(postAPIResponse.status()).toBe(200);

    const postAPIResponseBody = await postAPIResponse.json();
    console.log(postAPIResponseBody);

    // Step - Assert response and posted data
    expect(postAPIResponseBody.data).toHaveProperty("ProductId", 24);
    expect(postAPIResponseBody.data).toHaveProperty("quantity", 1);
    console.log("Successfully Posted Orders");
    console.log("========================");


    // Step - Delete the basket item using the extracted id
    const basketItemId = postAPIResponseBody.data.id;
    const deleteResponse = await apiContext.delete(`/api/BasketItems/${basketItemId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    expect(deleteResponse.ok()).toBeTruthy();
    expect(deleteResponse.status()).toBe(200);
    console.log("Successfully Deleted Orders");
    console.log("========================");

});

test('API Test 3 - Create POST API request to add Address', async ({ request }) => {
    const postAPIResponse = await request.post('/api/Addresss/', {
        data: addressPayLoad,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    // Step - Validate status code
    expect(postAPIResponse.ok()).toBeTruthy();
    expect(postAPIResponse.status()).toBe(201);

    const postAPIResponseBody = await postAPIResponse.json();
    console.log(postAPIResponseBody);

    // Step - Assert response and posted data
    expect(postAPIResponseBody.data).toHaveProperty("country", "Philippines");
    expect(postAPIResponseBody.data).toHaveProperty("fullName", "Val Rigor");

});

test('API Test 4 - Negative Scenario POST API request with Unauthorised Response', async ({ request }) => {
    //Step - First API POST Response
    const postFirstAPIResponse = await request.post('/api/Users/', {
        data: dupeUserRegistrationPayLoad,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    // Step - Validate status code
    expect(postFirstAPIResponse.ok()).toBeTruthy();
    expect(postFirstAPIResponse.status()).toBe(201);
    console.log("Successfully Registered New User");
    console.log("========================");

    const postFirstAPIResponseBody = await postFirstAPIResponse.json();
    console.log(postFirstAPIResponseBody);

    const postDuplicateAPIResponse = await request.post('/api/Users/', {
        data: dupeUserRegistrationPayLoad,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    // Step - Validate status code    
    expect(postDuplicateAPIResponse.ok()).toBeFalsy();
    expect(postDuplicateAPIResponse.status()).toBe(400);

    const postDupelicateAPIResponseBody = await postDuplicateAPIResponse.json();
    console.log(postDupelicateAPIResponseBody);

});


