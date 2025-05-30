import { test, expect } from './fixtures';
import { getFormattedDateNDaysFromToday } from '../utils/date_utils';
import { DEFAULT_DESTINATION } from '../config/test_config';
import { ListingPage } from '../pages/listing_page';
import { ResultsPage } from '../pages/results_page';

test('Step 4: Change booking dates on listing page', async ({ page, context, homePage }) => {
  const checkIn = getFormattedDateNDaysFromToday(1);
  const checkOut = getFormattedDateNDaysFromToday(3);
  const newCheckIn = getFormattedDateNDaysFromToday(5);
  const newCheckOut = getFormattedDateNDaysFromToday(7);

  // Given I search for a destination with initial dates and guests
  await homePage.navigateToHome();
  await homePage.enterDestination(DEFAULT_DESTINATION);
  await homePage.selectDates(checkIn, checkOut);
  await homePage.openGuestsPicker();
  await homePage.increaseAdultCount(2);
  await homePage.increaseChildCount(1);
  await homePage.clickSearch();

  await page.pause();

  const resultsPage = new ResultsPage(page);
  const listingPage = await resultsPage.clickHighestRatedListing(context);
  await listingPage.waitForPageToLoad();

  await page.pause();

  // When I attempt to change booking dates
  const updated = await listingPage.changeBookingDates(newCheckIn, newCheckOut);

  await page.pause();

  const { checkIn: actualCheckIn, checkOut: actualCheckOut } = await listingPage.getDisplayedDates();

  // Then validate the correct dates appear (updated or fallback)
  if (updated) {
    expect(actualCheckIn).toBe(newCheckIn);
    expect(actualCheckOut).toBe(newCheckOut);
    console.log('✅ Successfully updated dates');
  } else {
    expect(actualCheckIn).toBe(checkIn);
    expect(actualCheckOut).toBe(checkOut);
    console.warn('⚠️ Dates unavailable, original dates retained');
  }
});


  
//   await page.pause();