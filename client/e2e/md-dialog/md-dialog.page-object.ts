import { element, by, ElementFinder } from 'protractor';

export class MdDialogPageObject {
  overlayContainer: ElementFinder = element(by.css('.cdk-overlay-container'));
  dialogContainer: ElementFinder = this.overlayContainer.element(by.tagName('md-dialog-container'));

  getDialogComponent(tagName: string): ElementFinder {
    return this.dialogContainer.element(by.tagName(tagName));
  }
}
