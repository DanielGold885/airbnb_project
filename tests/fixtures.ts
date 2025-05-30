import { test as base, expect as baseExpect } from '@playwright/test';
import { HomePage } from '../pages/home_page';
import { ResultsPage } from '../pages/results_page';

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

export { baseExpect as expect };
