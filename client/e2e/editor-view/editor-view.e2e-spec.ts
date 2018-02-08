import { browser, protractor, element, by } from 'protractor';
import { ML_YAML_FILENAME } from '@machinelabs/core';

import { waitForContentReady } from './../utils';
import { EditorViewPageObject } from './editor-view.page-object';

describe('Editor-View Component', function() {
  const editorView: EditorViewPageObject = new EditorViewPageObject();

  beforeEach(() => {
    browser.get('/editor');
    waitForContentReady();
  });

  it('should contain the "Editor" and "Console" tabs', () => {
    expect(editorView.tabsLabels).toEqual(['Editor', 'Console', 'Outputs']);
  });

  it('should have the "Editor" tab selected by default', () => {
    expect(editorView.activeTabLabel).toEqual('Editor');
  });

  describe('in EDIT mode', () => {
    it('should display the current lab file structure', () => {
      expect(editorView.fileTree.count()).toEqual(2);
      expect(editorView.getFileName(0)).toContain('main.py');
      expect(editorView.getFileName(1)).toContain(ML_YAML_FILENAME);
    });

    it('should not allow users to edit mandatory file names', () => {
      // index 1 == ml.yaml (this file is mandatory)
      let fileIndex = 1;
      expect(editorView.getFileEditBtn(fileIndex).isPresent()).toEqual(false);
    });

    it('should allow users to add new files', () => {
      editorView.addFile('ml-main-2.py');
      expect(editorView.fileTree.count()).toEqual(3);
    });

    it('should allow users to edit file names', () => {
      let fileIndex = 2;

      editorView.addFile('ml-main-2.py');
      editorView.changeFileName(fileIndex, 'changed.py');
      expect(editorView.getFileName(fileIndex)).toContain('changed.py');
    });

  });
});
