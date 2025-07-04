import { Page, Locator } from '@playwright/test';
import { BASE_URL } from '../config/test_config';
import { TIMEOUTS } from '../config/timeouts';


export class HomePage {
  private destinationInput: Locator;
  private guestPickerButton: Locator;
  private searchButton: Locator;
  private addAdultButton: Locator;
  private removeAdultButton: Locator;
  private addChildButton: Locator;
  private removeChildButton: Locator;

  constructor(private page: Page) {
    this.destinationInput = page.locator('input[placeholder="Search destinations"]');
    this.guestPickerButton = page.getByText('Add guests', { exact: true });
    this.searchButton = page.locator('div.s15knsuf').first();

    this.addAdultButton = page.locator('[data-testid="stepper-adults-increase-button"]').first();
    this.removeAdultButton = page.locator('[data-testid="stepper-adults-decrease-button"]').first();

    this.addChildButton = page.locator('[data-testid="stepper-children-increase-button"]').first();
    this.removeChildButton = page.locator('[data-testid="stepper-children-decrease-button"]').first();
  }

  getCalendarDayLocator(date: string) {
    return this.page.locator(`button[data-state--date-string="${date}"]`).first();
  }

  async navigateToHome() {
    await this.page.goto(BASE_URL);
    await this.destinationInput.waitFor({ state: 'visible', timeout: TIMEOUTS.long });
  }

  async enterDestination(destination: string) {
    await this.destinationInput.click();
    await this.destinationInput.fill(destination);
    await this.page.keyboard.press('Enter');
  }

  async selectDates(checkIn: string, checkOut: string) {
    const checkInLocator = this.getCalendarDayLocator(checkIn);
    const checkOutLocator = this.getCalendarDayLocator(checkOut);

    await checkInLocator.scrollIntoViewIfNeeded();
    await checkInLocator.click();

    await checkOutLocator.scrollIntoViewIfNeeded();
    await checkOutLocator.click();
  }

  async openGuestsPicker() {
    await this.guestPickerButton.click();
  }

  async increaseAdultCount(times: number) {
    for (let i = 0; i < times; i++) {
      await this.addAdultButton.click();
    }
  }  

  async decreaseAdultCount(times: number) {
    for (let i = 0; i < times; i++) {
      await this.removeAdultButton.click();
    }
  }

  async increaseChildCount(times: number) {
    for (let i = 0; i < times; i++) {
      await this.addChildButton.click();
    }
  }

  async decreaseChildCount(times: number) {
    for (let i = 0; i < times; i++) {
      await this.removeChildButton.click();
    }
  }

  async clickSearch() {
    await this.searchButton.waitFor({ state: 'visible', timeout: TIMEOUTS.medium });
    await this.searchButton.click();
  }
}
