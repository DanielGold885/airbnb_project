import { test } from '../infra/test_hooks';
import { getFormattedDateNDaysFromToday } from '../utils/date_utils';
import { DEFAULT_DESTINATION, DEFAULT_GUESTS } from '../config/test_config';
import { UrlUtils } from '../utils/url_utils';

test('Test: Change booking dates on listing page and validate URL params', async ({ context, homePage, resultsPage }) => {
    const checkIn = getFormattedDateNDaysFromToday(1);
    const checkOut = getFormattedDateNDaysFromToday(3);
    const newCheckIn = getFormattedDateNDaysFromToday(5);
    const newCheckOut = getFormattedDateNDaysFromToday(7);
  
    await homePage.navigateToHome();
    await homePage.enterDestination(DEFAULT_DESTINATION);
    await homePage.selectDates(checkIn, checkOut);
    await homePage.openGuestsPicker();
    await homePage.increaseAdultCount(2);
    await homePage.increaseChildCount(1);
    await homePage.clickSearch();

    await resultsPage.waitForResultsToLoad();

    const listingPage = await resultsPage.clickHighestRatedListing(context);
    await listingPage.waitForPageToLoad();
    await listingPage.validateGuestCount(DEFAULT_GUESTS.total);
    await listingPage.validateDisplayedDates(checkIn, checkOut);
  
    const updated = await listingPage.changeBookingDates(newCheckIn, newCheckOut);

    await listingPage.validateUpdatedOrFallbackDates(
      { checkIn, checkOut },
      { checkIn: newCheckIn, checkOut: newCheckOut },
      updated
    );

    await listingPage.openGuestsPicker();
    await listingPage.increaseAdultCount(1);
    await listingPage.validateGuestCount(4);
    await listingPage.closeGuestPicker();
    await listingPage.clickReserveButton();
    
    const expectedCheckIn = updated ? newCheckIn : checkIn;
    const expectedCheckOut = updated ? newCheckOut : checkOut;
    
    UrlUtils.assertUrlIncludes(listingPage.pageInstance, '/book/stays');
    UrlUtils.assertUrlParam(listingPage.pageInstance, 'checkin', expectedCheckIn);
    UrlUtils.assertUrlParam(listingPage.pageInstance, 'checkout', expectedCheckOut);
    UrlUtils.assertUrlParam(listingPage.pageInstance, 'numberOfAdults', '3');
  });
