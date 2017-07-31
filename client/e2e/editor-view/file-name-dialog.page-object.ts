import { element, by, ElementFinder } from 'protractor';

import { MdDialogPageObject } from './../md-dialog/md-dialog.page-object';


export class FileNameDialogPageObject {
  mdDialog = new MdDialogPageObject();
  dialog: ElementFinder = this.mdDialog.getDialogComponent('ml-file-name-dialog');
  header: ElementFinder = this.dialog.element(by.tagName('ml-dialog-header'));
  fileNameInput: ElementFinder = this.dialog.element(by.css('input'));

  get okBtn(): ElementFinder {
    return this._btnBar.element(by.css('button[type=submit]'));
  }

  get cancelBtn(): ElementFinder {
    return this._btnBar.element(by.buttonText('Cancel'));
  }

  enterFileName(name: string): void {
    this.fileNameInput.clear();
    this.fileNameInput.sendKeys(name);
  }

  get _btnBar(): ElementFinder {
    return this.dialog.element(by.tagName('ml-dialog-cta-bar'));
  }
}
