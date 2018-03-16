import { browser, protractor, element, by } from 'protractor';

import { waitForContentReady } from './../utils';
import { EmbeddedEditorViewPageObject } from './embedded-editor-view.page-object';

describe('Editor-View Component', () => {
  const embeddedEditorView = new EmbeddedEditorViewPageObject();

  beforeEach(() => {
    browser.get('/embedded');
    waitForContentReady();
  });

  it('should active tab by query parameter', () => {
    browser.get('/embedded?tab=console');
    waitForContentReady();
    expect(embeddedEditorView.activeTabLabel).toEqual('Console');
  });
});
