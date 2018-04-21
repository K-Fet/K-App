import { browser, by, element } from 'protractor';

export class AppPage {
    // tslint:disable-next-line:typedef
    navigateTo() {
        return browser.get('/');
    }

    // tslint:disable-next-line:typedef
    getParagraphText() {
        return element(by.css('app-root h1')).getText();
    }
}
