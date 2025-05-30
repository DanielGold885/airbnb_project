import { Page, Locator } from '@playwright/test';

export class ListingPage {
  private page: Page;

  // Define locators in constructor
  private dateSummary: Locator;
  private guestSummary: Locator;
  private bookingSidebar: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dateSummary = page.locator('[data-testid="structured-display-input-field-dates"]');
    this.guestSummary = page.locator('[data-testid="structured-display-input-field-guests"]');
    this.bookingSidebar = page.locator('[data-section-id="BOOK_IT_SIDEBAR"]');
  }

  async waitForPageToLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.bookingSidebar.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getDisplayedDates(): Promise<string> {
    return (await this.dateSummary.textContent()) || '';
  }

  async getDisplayedGuests(): Promise<string> {
    return (await this.guestSummary.textContent()) || '';
  }
}
