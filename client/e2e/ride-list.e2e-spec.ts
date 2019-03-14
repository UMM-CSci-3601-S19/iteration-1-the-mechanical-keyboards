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
    return protractor.promise.delayed(50);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};


describe('Ride list', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
  });

  it('should get and highlight Rides title attribute ', () => {
    page.navigateTo();
    expect(page.getRideTitle()).toEqual('Upcoming Rides');
  });

  it('should load some rides', () => {
    expect(page.elementExistsWithCss('.rides')).toBeTruthy();
  });

  it('Should have an add ride button', () => {
    page.navigateTo();
    expect(page.elementExistsWithId('add-ride-button')).toBeTruthy();
  });

  it('Should open a page when add ride button is clicked', () => {
    page.navigateTo();
    page.click('add-ride-button');
    expect(page.getAddRideTitle()).toEqual('Add a Ride');
  });
});

describe('Add Ride', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
    page.navigateTo();
    page.click('add-ride-button');
  });

  it('Should add the information we put in the fields by keystroke to the database', () => {
    page.navigateTo();
    page.click('add-ride-button');

    page.field('driverID').sendKeys('John Doe');
    page.field('notesField').sendKeys('Likes to play music. Climate control. Gregarious.');
    page.field('seatsAvailableField').sendKeys('2');
    page.field('originField').sendKeys('Morris, MN');
    page.field('destinationField').sendKeys('Alexandria, MN');
    page.field('departureDateField').sendKeys('3/13/2019');
    page.field('departureTimeField').sendKeys('6:00PM');


    page.click('confirmAddRideButton')
    expect(page.getRideTitle()).toEqual('Upcoming Rides');
    expect(page.getUniqueRide('John Doe')).toMatch('Likes to play music. Climate control. Gregarious.');
    expect(page.getUniqueRide('John Doe')).toMatch('2');
    expect(page.getUniqueRide('John Doe')).toMatch('Morris, MN');
    expect(page.getUniqueRide('John Doe')).toMatch('Alexandria, MN');
    expect(page.getUniqueRide('John Doe')).toMatch('March 13th at 06:00 PM');

  });

  it('Should add the information to the database if non-required data is missing', () => {
    page.navigateTo();
    page.click('add-ride-button');
    page.field('driverID').sendKeys('Jefferson Macaroni');
    page.field('seatsAvailableField').sendKeys('4');
    page.field('originField').sendKeys('Washington, D.C.');
    page.field('destinationField').sendKeys('Morris, MN');
    page.click('confirmAddRideButton')

    expect(page.getUniqueRide('Jefferson Macaroni')).toMatch('Washington, D.C.');
    expect(page.getUniqueRide('Jefferson Macaroni')).toMatch('Morris, MN');
    expect(page.getUniqueRide('Jefferson Macaroni')).toMatch('4');

  });
});




