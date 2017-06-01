import { browser, protractor, element, by } from 'protractor';

import { waitForContentReady } from './../utils';
import { EditorViewPageObject } from './editor-view.page-object';

describe('Editor-View Component', function() {
  const editorView: EditorViewPageObject = new EditorViewPageObject();

  beforeEach(() => {
    browser.get('/');
    waitForContentReady();
  });

  it('should contain the "Editor", "Console" and "Settings" tabs', () => {
    expect(editorView.tabsLabels).toEqual(['Editor', 'Console', 'Settings']);
  });

  it('should have the "Editor" tab selected by default', () => {
    expect(editorView.activeTabLabel).toEqual('Editor');
  });

  it('should show the correct editor theme when switching editor views', () => {
    expect(editorView.editorMode).toEqual('python');

    editorView.getTabByLabel('Console').click();
    expect(editorView.editorMode).toEqual('sh');

    editorView.getTabByLabel('Editor').click();
    expect(editorView.editorMode).toEqual('python');
  });


  describe('in EDIT mode', () => {
    it('should display the current lab file structure', () => {
      expect(editorView.fileList.count()).toEqual(1);
      expect(editorView.getFileName(0)).toContain('main.py');
    });

    it('should display the current lab description', () => {
      expect(editorView.labDescription).toEqual('');
    });

    it('should display the current lab tags', () => {
      expect(editorView.labTags).toEqual([]);
    });

    it('should allow users to edit file names', () => {
      let fileIndex = 0;

      editorView.changeFileName(fileIndex, 'ml-main.py');
      expect(editorView.getFileName(fileIndex)).toContain('ml-main.py');
    });

    it('should allow users to add new files', () => {
      editorView.addFile('ml-main-2.py');
      expect(editorView.fileList.count()).toEqual(2);
    });
  });
});
