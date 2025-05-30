import { Page, Locator } from '@playwright/test';

export class ListingPage {
  private bookingSidebar: Locator;
  private checkInDate: Locator;
  private checkOutDate: Locator;
  private guestSummary: Locator;
  private closeCalendarButton: Locator;
  private calendarDay: (date: string) => Locator;

  constructor(private page: Page) {
    this.bookingSidebar = page.locator('[data-section-id="BOOK_IT_SIDEBAR"]');
    this.checkInDate = page.locator('[data-testid="change-dates-checkIn"]');
    this.checkOutDate = page.locator('[data-testid="change-dates-checkOut"]');
    this.guestSummary = page.locator('span._j1kt73:has-text("guests")');
    this.closeCalendarButton = page.getByRole('button', { name: 'Close' });
    this.calendarDay = (date: string) =>
      page.locator(`[data-testid="calendar-day-${this.formatForTestId(date)}"]`);
  }

  private formatForTestId(date: string): string {
    const [year, month, day] = date.split('-');
    return `${month}/${day}/${year}`;
  }

  async waitForPageToLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.bookingSidebar.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getDisplayedDates(): Promise<{ checkIn: string; checkOut: string }> {
    const checkInText = await this.checkInDate.textContent();
    const checkOutText = await this.checkOutDate.textContent();

    if (!checkInText || !checkOutText) {
      throw new Error('❌ Could not retrieve displayed dates on listing page');
    }

    const parseDate = (raw: string): string => {
      const [month, day, year] = raw.split('/').map(Number);
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    return {
      checkIn: parseDate(checkInText),
      checkOut: parseDate(checkOutText),
    };
  }

  async getDisplayedGuestCount(): Promise<number> {
    const text = await this.guestSummary.textContent();
    const match = text?.match(/(\d+)\s*guests?/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  async isDateAvailable(date: string): Promise<boolean> {
    return this.calendarDay(date).isEnabled();
  }

  async changeBookingDates(newCheckIn: string, newCheckOut: string): Promise<boolean> {
    await this.checkInDate.click();
    await this.page.waitForTimeout(2000);

    const checkInDay = this.calendarDay(newCheckIn);
    const checkOutDay = this.calendarDay(newCheckOut);

    const checkInAvailable = await checkInDay.isEnabled();
    const checkOutAvailable = await checkOutDay.isEnabled();

    if (!checkInAvailable || !checkOutAvailable) {
      if (await this.closeCalendarButton.isVisible()) {
        await this.closeCalendarButton.click();
      }
      return false;
    }

    await checkInDay.scrollIntoViewIfNeeded();
    await checkInDay.click();

    await checkOutDay.scrollIntoViewIfNeeded();
    await checkOutDay.click();

    if (await this.closeCalendarButton.isVisible()) {
      await this.closeCalendarButton.click();
    }

    await this.page.waitForTimeout(800);
    return true;
  }
}
