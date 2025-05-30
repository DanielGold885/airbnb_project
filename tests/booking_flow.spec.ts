import { test, expect } from './fixtures';
import { getFormattedDateNDaysFromToday } from '../utils/date_utils';
import { DEFAULT_DESTINATION } from '../config/test_config';
import { ListingPage } from '../pages/listing_page';
import { ResultsPage } from '../pages/results_page';

test('Step 3: Validate listing details match search', async ({ homePage, page }) => {
    const checkIn = getFormattedDateNDaysFromToday(0);
    const checkOut = getFormattedDateNDaysFromToday(2);
  
    await homePage.navigateToHome();
    await homePage.enterDestination(DEFAULT_DESTINATION);
    await homePage.selectDates(checkIn, checkOut);
    await homePage.openGuestsPicker();
    await homePage.increaseAdultCount(2);
    await homePage.increaseChildCount(1);
    await homePage.clickSearch();
    await page.waitForTimeout(8000)
  
    const resultsPage = new ResultsPage(page);
    await resultsPage.clickFirstHighestRatedListing();
  
    const listingPage = new ListingPage(page);
    await listingPage.waitForPageToLoad();

    await page.pause();

  
    const guestsText = await listingPage.getDisplayedGuests();
    const datesText = await listingPage.getDisplayedDates();
  
    console.log(`Guests shown: ${guestsText}`);
    console.log(`Dates shown: ${datesText}`);
  
    expect(guestsText.toLowerCase()).toContain('3');
    // You can make the date expectation smarter once you confirm their display format
  });
  