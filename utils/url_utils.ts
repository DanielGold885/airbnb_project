import { Page, expect } from '@playwright/test';

export class UrlUtils {
  static assertUrlIncludes(page: Page, fragment: string): void {
    const url = page.url();
    expect(url).toContain(fragment);
    console.log(`✅ URL includes "${fragment}"`);
  }

  static assertUrlParam(page: Page, key: string, expectedValue: string): void {
    const url = new URL(page.url());
    const actual = url.searchParams.get(key);
    expect(actual).toBe(expectedValue);
    console.log(`✅ URL param "${key}" = "${expectedValue}"`);
  }
}
