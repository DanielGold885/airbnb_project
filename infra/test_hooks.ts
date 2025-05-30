import { test as base, expect as baseExpect } from '@playwright/test';
import { HomePage } from '../pages/home_page';
import { ResultsPage } from '../pages/results_page';
import fs from 'fs';
import path from 'path';

type MyFixtures = {
  homePage: HomePage;
  resultsPage: ResultsPage;
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  resultsPage: async ({ page }, use) => {
    await use(new ResultsPage(page));
  },
});

test.beforeEach(async ({}, testInfo) => {
  console.log(`🔹 Starting test: ${testInfo.title}`);
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshotDir = path.join('test-results', 'failures');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const fileName = `${testInfo.title.replace(/\W+/g, '_')}.png`;
    const filePath = path.join(screenshotDir, fileName);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`❌ Screenshot saved to ${filePath}`);
  } else {
    console.log(`✅ Finished test: ${testInfo.title}`);
  }
});

export { baseExpect as expect };
