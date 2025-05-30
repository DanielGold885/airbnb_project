import { test, expect } from './fixtures';
import { getFormattedDateNDaysFromToday } from '../utils/date_utils';
import { DEFAULT_DESTINATION, DEFAULT_GUESTS } from '../config/test_config';
import { ListingPage } from '../pages/listing_page';
import { ResultsPage } from '../pages/results_page';
import { UrlUtils } from '../utils/url_utils';

test('Step 4: Change booking dates on listing page', async ({ page, context, homePage }) => {
    const checkIn = getFormattedDateNDaysFromToday(1);
    const checkOut = getFormattedDateNDaysFromToday(3);
    const newCheckIn = getFormattedDateNDaysFromToday(5);
    const newCheckOut = getFormattedDateNDaysFromToday(7);
  
    // Given
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

    await listingPage.validateGuestCount(DEFAULT_GUESTS.total);
  
    await listingPage.validateDisplayedDates(checkIn, checkOut);

    
    await page.pause();
  
    // When
    const updated = await listingPage.changeBookingDates(newCheckIn, newCheckOut);

  
    // Then
    await listingPage.validateUpdatedOrFallbackDates(
      { checkIn, checkOut },
      { checkIn: newCheckIn, checkOut: newCheckOut },
      updated
    );

    await listingPage.openGuestsPicker();
    await listingPage.increaseAdultCount(1);

    await listingPage.validateGuestCount(4);
    await listingPage.closeGuestPicker();


    await page.pause();

    
    await listingPage.clickReserveButton();
    console.log('🌐 Current URL after clicking Reserve:', listingPage.pageInstance.url());
    
    UrlUtils.assertUrlIncludes(listingPage.pageInstance, '/book/stays');
    UrlUtils.assertUrlParam(listingPage.pageInstance, 'checkin', newCheckIn);
    UrlUtils.assertUrlParam(listingPage.pageInstance, 'checkout', newCheckOut);
    UrlUtils.assertUrlParam(listingPage.pageInstance, 'numberOfAdults', '3');

  });


  
//   await page.pause();