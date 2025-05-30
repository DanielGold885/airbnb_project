import { BrowserContext, Page } from '@playwright/test';

export class BrowserUtils {
  /**
   * Waits for a new tab (Page) to open and returns it.
   * Use this immediately after clicking something that opens a new tab.
   */
  static async waitForNewTab(context: BrowserContext): Promise<Page> {
    return await context.waitForEvent('page');
  }

  /**
   * Returns the tab (Page) by index.
   */
  static switchToTabByIndex(context: BrowserContext, index: number): Page {
    return context.pages()[index];
  }

  /**
   * Closes the current tab and switches back to another tab (default index = 0).
   */
  static async closeTabAndSwitchBack(currentPage: Page, context: BrowserContext, index = 0): Promise<Page> {
    await currentPage.close();
    return context.pages()[index];
  }
}