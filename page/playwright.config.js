// @ts-check
// import { defineConfig, devices } from '@playwright/test';
const { defineConfig, devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './playwright_tests',
  timeout: 20 * 1000,
    expect: {
      timeout: 5000      
    },
    reporter: 'html',
  use: {
   browserName: 'chromium',
   headless: false,
   screenshot: 'on',
   trace: 'on',
   baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace: 'on-first-retry',
  },


});


