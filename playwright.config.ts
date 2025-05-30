import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

export default defineConfig({
  use: {
    browserName: (process.env.BROWSER as 'chromium' | 'firefox' | 'webkit') || 'chromium',
    headless: false,
    baseURL: 'https://www.airbnb.com',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  testDir: './tests',
});

