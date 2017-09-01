import { TestBed } from '@angular/core/testing';
import { EditorTestingModule } from './testing/editor-testing.module';
import { Location } from '@angular/common';
import { UrlSerializer } from '@angular/router';

import { LAB_STUB } from '../../test-helper/stubs/lab.stubs';

import { EditorService, TabIndex } from './editor.service';

describe('EditorService', () => {

  let editorService: EditorService;
  let location: Location;
  let urlSerializer: UrlSerializer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditorTestingModule]
    });

    editorService = TestBed.get(EditorService);
    location = TestBed.get(Location);
    urlSerializer = TestBed.get(UrlSerializer);
  });

  describe('.initLab()', () => {

    const expectedLab = Object.assign({}, LAB_STUB);

    it('should initialze lab', () => {
      editorService.initLab(expectedLab);
      expect(editorService.lab).toEqual(expectedLab);
      expect(editorService.latestLab).toEqual(expectedLab);
    });

    it('should activate first file in lab directory', () => {
      editorService.initLab(expectedLab);
      expect(editorService.activeFile).toEqual(expectedLab.directory[0]);
    });

    it('should update query param with first active file in lab directory', () => {
      editorService.initLab(expectedLab);
      expect(urlSerializer.parse(location.path()).queryParams.file)
        .toEqual(expectedLab.directory[0].name);
    });

    it('should set tab query param to \'editor\' by default', () => {
      editorService.initLab(expectedLab);
      expect(urlSerializer.parse(location.path()).queryParams.tab)
        .toEqual(TabIndex.Editor);
    });

    it('should activate query param file', () => {
      location.go(`/?file=${expectedLab.directory[1].name}`);
      editorService.initLab(expectedLab);
      expect(editorService.activeFile).toEqual(expectedLab.directory[1]);
    });
  });

  describe('.initDirectory()', () => {

    const expectedLab = Object.assign({}, LAB_STUB);

    it('should init lab directory', () => {
      editorService.initLab(expectedLab);
      editorService.initDirectory(expectedLab.directory);
      expect(editorService.lab.directory).toEqual(expectedLab.directory);
    });

    it('should init active file', () => {
      editorService.initLab(expectedLab);
      editorService.initDirectory(expectedLab.directory);
      expect(editorService.activeFile).toEqual(expectedLab.directory[0]);
    });
  });

  describe('.selectTab()', () => {

    it('should update tab query param accordingly', () => {
      editorService.selectTab(TabIndex.Editor);

      expect(urlSerializer.parse(location.path()).queryParams.tab)
        .toEqual(TabIndex.Editor);

      editorService.selectTab(TabIndex.Console);

      expect(urlSerializer.parse(location.path()).queryParams.tab)
        .toEqual(TabIndex.Console);
    });
  });

  describe('.selectEditorTab()', () => {

    it('should select TabIndex.Editor', () => {
      editorService.selectEditorTab();
      expect(editorService.selectedTab).toEqual(TabIndex.Editor);
    });
  });

  describe('.selectConsoleTab()', () => {

    it('should select TabIndex.Console', () => {
      editorService.selectConsoleTab();
      expect(editorService.selectedTab).toEqual(TabIndex.Console);
    });
  });
});
