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
  fileTree: ElementArrayFinder = element.all(by.css('.ml-file-tree-item'));
  addFileBtn: ElementFinder = element(by.css('.ml-file-tree-cta-bar .ml-file-tree-item-button'));

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

  getTabByLabel(label: string): ElementArrayFinder {
    return this.tabs.filter((elem, index) => elem.getText().then(text => text === label));
  }

  getFileByIndex(index: number): ElementFinder {
    return this.fileTree.get(index);
  }

  getFileName(index: number): promise.Promise<string> {
    return this.getFileByIndex(index).getText();
  }

  getFileEditBtn(index: number): ElementFinder {
    return this.getFileByIndex(index)
                        .element(by.css('.ml-file-tree-item-button.edit'));
  }

  addFile(name: string): void {
    this.addFileBtn.click();
    this.fileNameDialog.enterFileName(name);
    this.fileNameDialog.okBtn.click();
  }

  changeFileName(index: number, newName: string): void {
    browser.actions().mouseMove(this.getFileByIndex(index)).perform();
    const editButton = this.getFileEditBtn(index);
    if (editButton) {
      editButton.click();
      this.fileNameDialog.enterFileName(newName);
      this.fileNameDialog.okBtn.click();
    }
  }

  toggleFileTreeDrawer() {
    element(by.css('.ml-editor-view-file-drawer-toggle')).click();
  }
}
