import { protractor, browser, element, by, ElementFinder, ElementArrayFinder, promise } from 'protractor';

export class EmbeddedEditorViewPageObject {
  get activeTabLabel(): promise.Promise<string> {
    return element(by.css('.mat-tab-link[ng-reflect-active="true"]')).getText();
  }
}
