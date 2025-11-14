# Playwright Tests - Quick Start

[![Playwright](https://img.shields.io/badge/tested%20with-Playwright-45ba4b.svg)](https://playwright.dev/)

> Quick reference for running Playwright tests on OWASP Juice Shop

## Overview

This repository contains Playwright test automation covering API and UI testing for [OWASP Juice Shop](https://owasp-juice.shop). The application is not included but can be run via Docker or npm.


**Test Coverage**:
- API Tests: User registration, basket operations, address management, negative scenarios
- UI Tests: Registration, login, payment options, checkout flows
- Architecture: Page Object Model (POM) + API Utilities

---

## Prerequisites

### 1. Node.js
**Required**: Node.js 20.x, 22.x, or 24.x ([Download](https://nodejs.org))

```bash
node --version  # Verify installation
```

### 2. OWASP Juice Shop Running
Application must be running on `http://localhost:3000`

**Option A: Run Juice Shop with Docker**

  1. Make sure [Docker Desktop](https://www.docker.com/get-started) is installed and running.
  2. In this folder, open Terminal (or VSCode Terminal), start Juice Shop:
  ```bash
  docker-compose up -d
  ```
  3. Juice Shop will run at http://localhost:3000


**Option B: Run Juice Shop via npm**
  1. npm install -g juice-shop
  ```bash
  npm install -g juice-shop
  ```
  2. Start Juice Shop
  ```bash
  juice-shop
  ```
  3. Juice Shop will run at http://localhost:3000


---

## Setup Instructions to Install Dependecies for Playwright Tests

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Install Playwright Browsers
```bash
npx playwright install
```

On Linux, also install system dependencies:
```bash
npx playwright install-deps
```

### Step 3: Configure Base URL
Ensure `playwright.config.js` exists with:

```javascript
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
    //--optional configs
    browserName: 'chromium',
   headless: false,
   screenshot: 'on',
   trace: 'on',
   //----
  },
  testDir: './playwright_tests',
  timeout: 20 * 1000,
    expect: {
      timeout: 5000      
    },
    reporter: 'html',
  retries: 1,
  
});


### Step 4: Running Tests

### Basic Commands

```bash
# Run all tests
npx playwright test

# Run API tests only
npx playwright test api_test_flows.spec.js

# Run UI tests only
npx playwright test ui_test_flows.spec.js

# Run specific test
npx playwright test -g "API Test 1"
```
# You may view HTML Test Report
  ```bash
  npx playwright show-report
  ```
---

### Step 5: Update Test Data (IMPORTANT!)
**Avoid conflicts** by using unique email addresses:

```javascript
// api_test_flows.spec.js
const baseUserPayLoad = { 
  "email": "test_user_base_20250113@email.com",  // Add timestamp
  // ...
};
```
**Alternative: Restart Juice Shop - Stop-Start**
  A. via Docker: stop app by running docker-compose down followed by docker-compose up -d
  ```bash 
  docker-compose down
  docker-compose up -d
  ```

  B. via npm: stop app in terminal by entering Ctrl+C, followed by npm start
  ```bash 
  Ctrl + C
  npm start
  ```


### Advanced Options in Running Tests

```bash
# Headed mode (see browser)
npx playwright test --headed

# Interactive UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Specific browser
npx playwright test --project=chromium

# View HTML report
npx playwright show-report
```

---



## Test Structure

```
juice-shop/
├── playwright_tests/
│   ├── api_test_flows.spec.js       # API tests
│   ├── ui_test_flows.spec.js        # UI tests
│   ├── utils/
│   │   └── apiUtils.js              # API helpers
│   └── page/
│       ├── login_page.js
│       ├── main_dashboard.js
│       └── ...
├── playwright.config.js
└── package.json
```

### API Tests
1. User registration & validation
2. Basket operations (POST/DELETE)
3. Address management
4. Negative scenarios (duplicate user)

### UI Tests
1. Registration, login, logout
2. Payment options configuration
3. Product search & checkout
4. Account deletion & re-registration

---

## Troubleshooting

### "User already exists" Error
**Solution**: Reset database or update emails
```bash
cd juice-shop
rm data/juiceshop.sqlite
npm start
```

### "Login failed" or "Token undefined"
**Solution**: Verify base user credentials match and `createBaseUser()` succeeded

### Tests Timeout
**Solution**: 
- Verify `http://localhost:3000` is accessible
- Increase timeout in `playwright.config.js`

### "baseURL not configured"
**Solution**: Add to `playwright.config.js`:
```javascript
use: { baseURL: 'http://localhost:3000' }
```

---

## CI/CD Integration

Example GitHub Actions:
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm start & npx wait-on http://localhost:3000
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
  :
  :
  # rest of code
```
---
## Assumptions
1. Application State: OWASP Juice Shop is running locally before test execution.
2. Test Data Uniqueness: Unique email addresses required to be updated for each tests to avoid user registration conflicts and failures.
3. In API testing, dynamic Basket ID fetching is implemented as test will fail due to different user logins and authentication requirements.
4. Tokens: Tokens remain valid for the duration of test execution (no expiry handling implemented).
5. System Bug (?) Deleted user account/s cannot be re-registered. There is no database clean-up/deletion.
6. Tests are not fully isolated and share a base user credentials that may leave residual data. Test data accumulates over multiple runs and updating user emails for every test run is time consuming and introduces complexity to running the test.
7. Tested on chromium web browser only, config file can be extended to include Firefox and WebKit projects.

---
## What I would do given more time
1. Optimise API Tests for more detailed assertions
    a. Deeper property assertion
    b. Add graceful error handling 
    c. Add more specific error message validations for negative tests
2. Implement dynamic test data generation using faker.js 
3. Enhance test coverage for API Tests
    a. add PATCH/PUT endpoints
    b. authentication and edge case testings
    c. add sql injections attempts
4. Enhance test coverage for UI Tests
    a. cross-browser testing
    b. visual regression tests with screenshot comparisons
    c. concurrent login/activities testings    
5. Design a Hybrid Framework (Mix of API and UI) for some workflows (i.e. those requiring logins with authentications)
6. Centralised and Parameterised Test Data
7. Address system bug on User Account Deletion with database cleanup script

---
## References & Credits

### OWASP Juice Shop
- **Homepage**: [https://owasp-juice.shop](https://owasp-juice.shop)
- **GitHub**: [https://github.com/juice-shop/juice-shop](https://github.com/juice-shop/juice-shop)
- **Guide**: [Pwning OWASP Juice Shop](https://pwning.owasp-juice.shop)

### Project Leadership
- **Björn Kimminich** ([@bkimminich](https://github.com/bkimminich)) - Creator & Lead
- **Jannik Hollenbach** ([@J12934](https://github.com/J12934)) - Co-Lead

### Test Automation
- **Playwright**: [https://playwright.dev](https://playwright.dev) (Microsoft)
- **Test Suite Author**: Val Rigor (2025)

### Licensing
- **OWASP Juice Shop**: MIT License
- **Playwright**: Apache License 2.0
- **This Test Suite**: MIT License

---

## Support

- **Gitter Chat**: [https://gitter.im/bkimminich/juice-shop](https://gitter.im/bkimminich/juice-shop)
- **Playwright Docs**: [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)
- **Issues**: [GitHub Issues](https://github.com/juice-shop/juice-shop/issues)

---

**Happy Testing! 🧃🔒🎭**

*Last Updated: November 13, 2025*  
*Compatible with OWASP Juice Shop v19.0.0*
