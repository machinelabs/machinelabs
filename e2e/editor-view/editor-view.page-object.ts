import {
  protractor,
  browser,
  element,
  by,
  ElementFinder,
  ElementArrayFinder,
  promise
} from 'protractor';

import { FileNameDialogPageObject } from './file-name-dialog.page-object';


const EC = protractor.ExpectedConditions;


export class EditorViewPageObject {
  fileNameDialog: FileNameDialogPageObject = new FileNameDialogPageObject();

  tabs: ElementArrayFinder = element.all(by.css('.mat-tab-link'));
  fileList: ElementArrayFinder = element.all(by.css('.ml-file-list-item'));
  addFileBtn: ElementFinder = element(by.css('.ml-file-tree-cta.mat-button'));

  /**
   * TABS
   */
  get tabsLabels(): promise.Promise<Array<string>> {
    return this.tabs
            .reduce((acc: Array<string>, elem: ElementFinder) => {
              return elem.getText().then((text: string) => acc.concat(text));
    }, []);
  }

  get activeTabLabel(): promise.Promise<string> {
    return element(by.css('.mat-tab-link[ng-reflect-active="true"]')).getText();
  }

  get editorMode(): promise.Promise<string> {
    return element(by.tagName('ml-ace-editor.active')).getAttribute('mode');
  }

  getTabByLabel(label: string): ElementArrayFinder {
    return this.tabs.filter((elem, index) => elem.getText().then(text => text === label));
  }


  /**
   * SIDENAV
   */
  get labDescription(): promise.Promise<string> {
    return element(by.css('.ml-lab-description')).getText();
  }

  get labTags(): promise.Promise<Array<string>> {
    return element(by.tagName('ml-tag-list'))
              .all(by.tagName('md-chip'))
              .reduce((acc: Array<string>, elem: ElementFinder) => {
                return elem.getText().then((text: string) => acc.concat(text));
              }, []);
  }

  getFileByIndex(index: number): ElementFinder {
    return this.fileList.get(index);
  }

  getFileName(index: number): promise.Promise<string> {
    return this.getFileByIndex(index).getText();
  }

  getFileEditBtn(index: number): ElementFinder {
    return this.getFileByIndex(index)
                        .element(by.css('.ml-file-list-item-button.edit'));
  }

  addFile(name: string): void {
    this.addFileBtn.click();
    this.fileNameDialog.enterFileName(name);
    this.fileNameDialog.okBtn.click();
  }

  changeFileName(index: number, newName: string): void {
    browser.actions().mouseMove(this.getFileByIndex(index)).perform();
    this.getFileEditBtn(index).click();
    this.fileNameDialog.enterFileName(newName);
    this.fileNameDialog.okBtn.click();
  }
}
