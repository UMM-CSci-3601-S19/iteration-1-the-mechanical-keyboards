import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class RidePage {
  navigateTo(): promise.Promise<any> {
    return browser.get('/rides');
  }

  getRideTitle() {
    return element(by.id('ride-list-title')).getText();
  }

  getRides() {
    return element.all(by.className('rides'));
  }

  elementExistsWithId(id: string): promise.Promise<boolean> {
    return element(by.id(id)).isPresent();
  }

  elementExistsWithCss(css: string): promise.Promise<boolean> {
    return element(by.css(css)).isPresent();
  }

  getElementById(id: string) {
    return element(by.id(id));
  }

  getElementsByCss(css: string) {
    return element.all(by.css(css));
  }

  click(idOfButton: string): promise.Promise<void> {
    return element(by.id(idOfButton)).click();
  }
}
