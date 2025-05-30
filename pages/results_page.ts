import { Page, Locator } from '@playwright/test';

export class ResultsPage {
  private listingCards: Locator;

  constructor(private page: Page) {
    this.listingCards = page.locator('[itemprop="itemListElement"]');
  }

  async clickFirstHighestRatedListing() {
    const cards = await this.listingCards.all();
  
    const listingsWithRating: { card: Locator; rating: number }[] = [];
  
    for (const card of cards) {
      const span = card.locator('span[aria-hidden="true"]');
  
      const allSpans = await span.allTextContents();
  
      for (const text of allSpans) {
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
    console.log(`✅ Highest rating found: ${listingsWithRating[0].rating}`);
    await listingsWithRating[0].card.click();
  }  
}
