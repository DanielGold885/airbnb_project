import { chromium, Browser, Page } from 'playwright';

let browser: Browser;
let page: Page;

export async function launchBrowser(): Promise<Page> {
  browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext();
  page = await context.newPage();
  return page;
}

export async function closeBrowser(): Promise<void> {
  await browser.close();
}
