import { element, by, ElementFinder } from 'protractor';

export class MdDialogPageObject {
  overlayContainer: ElementFinder = element(by.css('.cdk-overlay-container'));
  overlayPane: ElementFinder = this.overlayContainer.element(by.css('.cdk-overlay-pane'));
  dialogContainer: ElementFinder = this.overlayPane.element(by.tagName('md-dialog-container'));

  getDialogComponent(tagName: string): ElementFinder {
    return this.dialogContainer.element(by.tagName(tagName));
  }
}
