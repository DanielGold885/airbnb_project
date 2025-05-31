import { Page, Locator, BrowserContext } from '@playwright/test';
import { ListingPage } from './listing_page';
import { BrowserUtils } from '../utils/browser_utils';
import { TIMEOUTS } from '../config/timeouts';

export class ResultsPage {
  private listingCards: Locator;
  private ratingSpan: (card: Locator) => Locator;

  constructor(private page: Page) {
    this.listingCards = page.locator('[itemprop="itemListElement"]');
    this.ratingSpan = (card: Locator) => card.locator('span[aria-hidden="true"]');
  }

  async waitForResultsToLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.listingCards.first().waitFor({ state: 'visible', timeout: TIMEOUTS.long });
  }

  async clickHighestRatedListing(context: BrowserContext): Promise<ListingPage> {
    const cards = await this.listingCards.all();

    const listingsWithRating: { card: Locator; rating: number }[] = [];

    for (const card of cards) {
      const spans = this.ratingSpan(card);
      const texts = await spans.allTextContents();

      for (const text of texts) {
        const match = text.match(/^(\d(?:\.\d{1,2})?) \(\d+\)$/);
        if (match) {
          const rating = parseFloat(match[1]);
          listingsWithRating.push({ card, rating });
          break;
        }
      }
    }

    if (!listingsWithRating.length) throw new Error('❌ No ratings found!');

    listingsWithRating.sort((a, b) => b.rating - a.rating);
    const bestListing = listingsWithRating[0].card;

    const [newTab] = await Promise.all([
      BrowserUtils.waitForNewTab(context),
      bestListing.click()
    ]);
    await this.page.waitForTimeout(2000);
    return new ListingPage(newTab);
  }
}
