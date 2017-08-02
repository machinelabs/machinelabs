import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { MachineLabsMaterialModule } from '../ml-material.module';

import { LAB_STUB } from '../../test-helper/stubs/lab.stubs';

import { LocationHelper } from '../util/location-helper';
import { EditorService, TabIndex } from './editor.service';
import { EditorSnackbarService } from './editor-snackbar.service';
import { RemoteLabExecService } from './remote-code-execution/remote-lab-exec.service';
import { DbRefBuilder } from '../firebase/db-ref-builder';
import { AuthService } from '../auth';
import { WindowRef } from '../window-ref.service';

import { DATABASE } from '../app.tokens';

import { DATABASE_STUB } from '../../test-helper/stubs/database.stubs';
import { AUTH_SERVICE_STUB } from '../../test-helper/stubs/auth.service.stubs';
import { LabExecutionService } from '../lab-execution.service';

describe('EditorService', () => {

  let editorService: EditorService;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MachineLabsMaterialModule
      ],
      providers: [
        LocationHelper,
        WindowRef,
        EditorService,
        EditorSnackbarService,
        RemoteLabExecService,
        LabExecutionService,
        { provide: AuthService, useValue: AUTH_SERVICE_STUB },
        { provide: DATABASE, useValue: DATABASE_STUB },
        DbRefBuilder
      ]
    });

    editorService = TestBed.get(EditorService);
    location = TestBed.get(Location);
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
      expect(location.path()).toEqual(`/?file=${expectedLab.directory[0].name}`);
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
