import { Page, Locator, expect } from '@playwright/test';

export class ListingPage {
  private bookingSidebar: Locator;
  private checkInDate: Locator;
  private checkOutDate: Locator;
  private guestSummary: Locator;
  private guestSummaryField: Locator;
  private closeCalendarButton: Locator;
  private increaseAdultButton: Locator;
  private reserveButton: Locator;
//   private closeGuestPickerButton: Locator;
  private calendarDay: (date: string) => Locator;

  constructor(private page: Page) {
    this.bookingSidebar = page.locator('[data-section-id="BOOK_IT_SIDEBAR"]');
    this.checkInDate = page.locator('[data-testid="change-dates-checkIn"]');
    this.checkOutDate = page.locator('[data-testid="change-dates-checkOut"]');
    this.guestSummary = page.locator('span._j1kt73:has-text("guests")');
    this.guestSummaryField = page.locator('#GuestPicker-book_it-trigger');
    this.increaseAdultButton = page.locator('[data-testid="GuestPicker-book_it-form-adults-stepper-increase-button"]');
    // this.closeGuestPickerButton = page.getByRole('button', { name: 'Close' }); // same label as calendar
    this.closeCalendarButton = page.getByRole('button', { name: 'Close' });
    this.reserveButton = this.bookingSidebar.locator('[data-testid="homes-pdp-cta-btn"]');
    this.calendarDay = (date: string) =>
      page.locator(`[data-testid="calendar-day-${this.formatForTestId(date)}"]`);
  }

  get pageInstance(): Page {
    return this.page;
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

  async validateDisplayedDates(expectedCheckIn: string, expectedCheckOut: string): Promise<void> {
    const { checkIn, checkOut } = await this.getDisplayedDates();

    expect(checkIn).toBe(expectedCheckIn);
    expect(checkOut).toBe(expectedCheckOut);

    console.log(`✅ Dates validated: ${checkIn} → ${checkOut}`);
  }

  async validateUpdatedOrFallbackDates(
    original: { checkIn: string; checkOut: string },
    updated: { checkIn: string; checkOut: string },
    wasUpdated: boolean
  ): Promise<void> {
    const displayed = await this.getDisplayedDates();
    const expected = wasUpdated ? updated : original;

    expect(displayed.checkIn).toBe(expected.checkIn);
    expect(displayed.checkOut).toBe(expected.checkOut);

    console.log(
      wasUpdated
        ? '✅ Successfully updated dates'
        : '⚠️ Dates unavailable, original dates retained'
    );
  }

  async getDisplayedGuestCount(): Promise<number> {
    const text = await this.guestSummary.textContent();
    const match = text?.match(/(\d+)\s*guests?/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  async validateGuestCount(expectedCount: number): Promise<void> {
    const actual = await this.getDisplayedGuestCount();
    expect(actual).toBe(expectedCount);
    console.log(`✅ Guest count validated: ${actual}`);
  }

  async isDateAvailable(date: string): Promise<boolean> {
    return this.calendarDay(date).isEnabled();
  }

  async openGuestsPicker(): Promise<void> {
    await this.guestSummaryField.click();
  }
  
  async increaseAdultCount(times: number = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.increaseAdultButton.click();
      await this.page.waitForTimeout(150);
    }
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
  async closeGuestPicker(): Promise<void> {
    if (await this.closeCalendarButton.isVisible()) {
      await this.closeCalendarButton.click();
      await this.page.waitForTimeout(500); // for UI collapse
    }
  }

  async clickReserveButton(): Promise<void> {
    // await this.reserveButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.reserveButton.click();
    console.log('✅ Clicked Reserve button');
  }
}
