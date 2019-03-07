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
    return protractor.promise.delayed(100);
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
    expect(page.getRideTitle()).toEqual('Rides');
  });

// For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final

  it('Should have an add ride button', () => {
    page.navigateTo();
    expect(page.elementExistsWithId('addNewRide')).toBeTruthy();
  });

  it('Should open a dialog box when add ride button is clicked', () => {
    page.navigateTo();
    expect(page.elementExistsWithCss('add-ride')).toBeFalsy('There should not be a modal window yet');
    page.click('addNewRide');
    expect(page.elementExistsWithCss('add-ride')).toBeTruthy('There should be a modal window now');
  });

  describe('Add Ride', () => {

    beforeEach(() => {
      page.navigateTo();
      page.click('addNewRide');
    });

    it('Should actually add the ride with the information we put in the fields', () => {
      page.navigateTo();
      page.click('addNewRide');
      page.field('nameField').sendKeys('Tracy Kim');
      // Need to clear the age field because the default value is -1.
      page.field('ageField').clear();
      page.field('ageField').sendKeys('26');
      page.field('companyField').sendKeys('Awesome Startup, LLC');
      page.field('emailField').sendKeys('tracy@awesome.com');
      expect(page.button('confirmAddRideButton').isEnabled()).toBe(true);
      page.click('confirmAddRideButton');

      /*
       * This tells the browser to wait until the (new) element with ID
       * 'tracy@awesome.com' becomes present, or until 10,000ms whichever
       * comes first. This allows the test to wait for the server to respond,
       * and then for the client to display this new ride.
       * http://www.protractortest.org/#/api?view=ProtractorExpectedConditions
       */
      const tracy_element = element(by.id('tracy@awesome.com'));
      browser.wait(protractor.ExpectedConditions.presenceOf(tracy_element), 10000);

      expect(page.getUniqueRide('tracy@awesome.com')).toMatch('Tracy Kim.*'); // toEqual('Tracy Kim');
    });

    describe('Add Ride (Validation)', () => {

      afterEach(() => {
        page.click('exitWithoutAddingButton');
      });

      it('Should allow us to put information into the fields of the add ride dialog', () => {
        expect(page.field('nameField').isPresent()).toBeTruthy('There should be a name field');
        page.field('nameField').sendKeys('Dana Jones');
        expect(element(by.id('ageField')).isPresent()).toBeTruthy('There should be an age field');
        // Need to clear this field because the default value is -1.
        page.field('ageField').clear();
        page.field('ageField').sendKeys('24');
        expect(page.field('companyField').isPresent()).toBeTruthy('There should be a company field');
        page.field('companyField').sendKeys('Awesome Startup, LLC');
        expect(page.field('emailField').isPresent()).toBeTruthy('There should be an email field');
        page.field('emailField').sendKeys('dana@awesome.com');
      });

      it('Should show the validation error message about age being too small if the age is less than 15', () => {
        expect(element(by.id('ageField')).isPresent()).toBeTruthy('There should be an age field');
        page.field('ageField').clear();
        page.field('ageField').sendKeys('2');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('nameField').click();
        expect(page.getTextFromField('age-error')).toBe('Age must be at least 15');
      });

      it('Should show the validation error message about age being required', () => {
        expect(element(by.id('ageField')).isPresent()).toBeTruthy('There should be an age field');
        page.field('ageField').clear();
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('nameField').click();
        expect(page.getTextFromField('age-error')).toBe('Age is required');
      });

      it('Should show the validation error message about name being required', () => {
        expect(element(by.id('nameField')).isPresent()).toBeTruthy('There should be a name field');
        // '\b' is a backspace, so this enters an 'A' and removes it so this
        // field is "dirty", i.e., it's seen as having changed so the validation
        // tests are run.
        page.field('nameField').sendKeys('A\b');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('ageField').click();
        expect(page.getTextFromField('name-error')).toBe('Name is required');
      });

      it('Should show the validation error message about the format of name', () => {
        expect(element(by.id('nameField')).isPresent()).toBeTruthy('There should be an name field');
        page.field('nameField').sendKeys('Don@ld Jones');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('ageField').click();
        expect(page.getTextFromField('name-error')).toBe('Name must contain only numbers and letters');
      });

      it('Should show the validation error message about the name being taken', () => {
        expect(element(by.id('nameField')).isPresent()).toBeTruthy('There should be an name field');
        page.field('nameField').sendKeys('abc123');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('ageField').click();
        expect(page.getTextFromField('name-error')).toBe('Name has already been taken');
      });

      it('Should show the validation error message about email format', () => {
        expect(element(by.id('emailField')).isPresent()).toBeTruthy('There should be an email field');
        page.field('nameField').sendKeys('Donald Jones');
        page.field('ageField').sendKeys('30');
        page.field('emailField').sendKeys('donjones.com');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('nameField').click();
        expect(page.getTextFromField('email-error')).toBe('Email must be formatted properly');
      });
    });
  });
});

