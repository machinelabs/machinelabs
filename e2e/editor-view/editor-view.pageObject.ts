import { element, by, ElementFinder, promise } from 'protractor';

export class EditorViewPageObject {
  get tabs() {
    return element.all(by.css('.mat-tab-label'));
  }

  get tabsLabels(): promise.Promise<Array<string>> {
    return this.tabs
            .reduce((acc: Array<string>, elem: ElementFinder) => {
              return elem.getText().then((text: string) => {
                console.log(text);
                return acc.concat(text);
              });
    }, []);
  }

  get activeTabLabel() {
    return element(by.css('.mat-tab-label-active')).getText();
  }
}
