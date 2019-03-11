import {RidePage} from './ride-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

// This line (combined with the function that follows) is here for us
// to be able to see what happens (part of slowing things down)
// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
  let args = arguments;

  // queue 100ms wait between test
  // This delay is only put here so that you can watch the browser do its thing.
  // If you're tired of it taking long you can remove this call or change the delay
  // to something smaller (even 0).
  origFn.call(browser.driver.controlFlow(), () => {
    return protractor.promise.delayed(0);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};


describe('Ride list', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
    page.navigateTo();
  });

  it('should get and highlight Upcoming Rides title attribute ', () => {
    expect(page.getRideTitle()).toEqual('Upcoming Rides');
  });

  it('should load every ride with all its contents', () => {
    const numberOfRides = page.getElementsByCss('rides').count();

    const departureTimesElements = page.getElementsByCss('departure-time').count();
    const seatsLeftElements = page.getElementsByCss('seats-left').count();
    const originElements = page.getElementsByCss('origin').count();
    const destinationElements = page.getElementsByCss('destination').count();
    const driverElements = page.getElementsByCss('driver').count();
    const notesElements = page.getElementsByCss('notes').count();

    expect(departureTimesElements).toEqual(numberOfRides);
    expect(seatsLeftElements).toEqual(numberOfRides);
    expect(originElements).toEqual(numberOfRides);
    expect(destinationElements).toEqual(numberOfRides);
    expect(driverElements).toEqual(numberOfRides);
    expect(notesElements).toEqual(numberOfRides);
  });
});

