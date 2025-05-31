import { chromium, firefox, webkit, Browser, Page, BrowserContext } from 'playwright';

let browser: Browser;
let context: BrowserContext;
let page: Page;

export async function launchBrowser(browserType: 'chromium' | 'firefox' | 'webkit' = 'chromium'): Promise<Page> {
  switch (browserType) {
    case 'firefox':
      browser = await firefox.launch({ headless: false, slowMo: 50 });
      break;
    case 'webkit':
      browser = await webkit.launch({ headless: false, slowMo: 50 });
      break;
    default:
      browser = await chromium.launch({ headless: false, slowMo: 50 });
  }

  context = await browser.newContext();
  page = await context.newPage();
  return page;
}

export async function closeBrowser(): Promise<void> {
  await browser.close();
}

export { browser, context, page };