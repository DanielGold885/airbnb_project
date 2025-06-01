import { Page, expect } from '@playwright/test';

  /**
   * Checks for a path fragment in the URL
   */
export class UrlUtils {
  static assertUrlIncludes(page: Page, fragment: string): void {
    const url = page.url();
    expect(url).toContain(fragment);
    console.log(`✅ URL includes "${fragment}"`);
  }

    /**
   * Checks a URL param value
   */
  static assertUrlParam(page: Page, key: string, expectedValue: string): void {
    const url = new URL(page.url());
    const actual = url.searchParams.get(key);
    expect(actual).toBe(expectedValue);
    console.log(`✅ URL param "${key}" = "${expectedValue}"`);
  }
}
