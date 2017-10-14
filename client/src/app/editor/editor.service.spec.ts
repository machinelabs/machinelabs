import { TestBed } from '@angular/core/testing';
import { EditorTestingModule } from './testing/editor-testing.module';
import { Location } from '@angular/common';
import { UrlSerializer } from '@angular/router';
import { File } from '@machinelabs/models';
import { Observable } from 'rxjs/Observable';

import { LAB_STUB } from '../../test-helper/stubs/lab.stubs';

import { EditorService, TabIndex } from './editor.service';
import { LocationHelper } from '../util/location-helper';

import { NameDialogComponent } from './name-dialog/name-dialog.component';

describe('EditorService', () => {

  let editorService: EditorService;
  let location: Location;
  let locationHelper: LocationHelper;
  let urlSerializer: UrlSerializer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditorTestingModule]
    });

    editorService = TestBed.get(EditorService);
    location = TestBed.get(Location);
    urlSerializer = TestBed.get(UrlSerializer);
    locationHelper = TestBed.get(LocationHelper);
  });

  describe('.initialize()', () => {

    it('should select editor tab if no tab query param is given', () => {
      editorService.initialize();
      expect(editorService.selectedTab).toEqual(TabIndex.Editor);
    });

    it('should fallback to editor tab if unknown tab param is given', () => {
      location.go(`/?tab=foo`);
      editorService.initialize();
      expect(editorService.selectedTab).toEqual(TabIndex.Editor);
    });

    it('should select correct tab based on tab query param', () => {
      location.go(`/?tab=${TabIndex.Editor}`);
      editorService.initialize();
      expect(editorService.selectedTab).toEqual(TabIndex.Editor);
      location.go(`/?tab=${TabIndex.Console}`);
      editorService.initialize();
      expect(editorService.selectedTab).toEqual(TabIndex.Console);
      location.go(`/?tab=${TabIndex.Outputs}`);
      editorService.initialize();
      expect(editorService.selectedTab).toEqual(TabIndex.Outputs);
    });
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

    it('should activate query param file when full path is given', () => {
      let expectedFile = { name: 'util.py', content: '' };

      expectedLab.directory = [
        { name: 'main.py', content: '' },
        { name: 'src', contents: [
          { name: 'lib', contents: [ expectedFile ] }
        ]}
      ];

      location.go(`/?file=/src/lib/util.py`);
      editorService.initLab(expectedLab);
      expect(editorService.activeFile).toEqual(expectedFile);
    });

    it('should activate main file if given path is broken', () => {
      let expectedFile = { name: 'main.py', content: '', clientState: { collapsed: true, selected: true } };

      expectedLab.directory = [
        { name: 'main.py', content: '' },
        { name: 'src', contents: [
          { name: 'lib', contents: [ { name: 'utils.py', content: '' } ] }
        ]}
      ];

      location.go('/?file=foo/bar');

      editorService.initLab(expectedLab);
      expect(editorService.activeFile).toEqual(expectedFile);
    });

    it('should update query params to fallback if given path is broken', () => {
      let expectedFile = { name: 'main.py', content: '' };

      expectedLab.directory = [
        { name: 'main.py', content: '' },
        { name: 'src', contents: [
          { name: 'lib', contents: [ expectedFile ] }
        ]}
      ];

      location.go('/?file=foo/bar');

      editorService.initLab(expectedLab);
      expect(location.path()).toEqual('/?file=main.py');
    });


    it('should activate query param file, even if path segment is ambiguous', () => {

      let expectedFile = { name: 'util.py', content: '' };

      expectedLab.directory = [
        { name: 'main.py', content: '' },
        // notice that we have a file and a directory called `src`
        { name: 'src', content: '' },
        { name: 'src', contents: [
          { name: 'lib', contents: [ expectedFile ] }
        ]}
      ];

      location.go(`/?file=/src/lib/util.py`);
      editorService.initLab(expectedLab);
      expect(editorService.activeFile).toEqual(expectedFile);
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


  describe('.openFile()', () => {

    it('should update query parameter with name of given file', () => {
      let file = { name: 'main.py', content: '' };
      spyOn(locationHelper, 'updateQueryParams');

      editorService.openFile(file);
      expect(locationHelper.updateQueryParams).toHaveBeenCalledWith(location.path(), {
        file: file.name
      });
    });

    it('should update query params with given file path', () => {
      let file = { name: 'main.py', content: '' };
      let filePath = 'foo/bar/' + file.name;
      spyOn(locationHelper, 'updateQueryParams');

      editorService.openFile(file, filePath);
      expect(locationHelper.updateQueryParams).toHaveBeenCalledWith(location.path(), {
        file: filePath
      });
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
