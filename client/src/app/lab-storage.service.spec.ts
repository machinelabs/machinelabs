import { TestBed } from '@angular/core/testing';
import { Inject } from '@angular/core';
import { File } from '@machinelabs/models';
import { of } from 'rxjs/observable/of';

import { LabStorageService } from './lab-storage.service';
import { LabTemplateService, InMemoryLabTemplateService, DEFAULT_LAB_TPL_ID } from './lab-template.service';
import { AuthService } from './auth';
import { DATABASE } from './app.tokens';
import { DbRefBuilder } from './firebase/db-ref-builder';
import { LAB_TEMPLATES } from './data/lab-templates';
import { FirebaseMock } from '../test-helper/firebase-mock';
import { LAB_STUB } from '../test-helper/stubs/lab.stubs';

let authServiceStub = {
  requireAuthOnce: () => { }
};

let databaseStub = {
  ref: (arg) => {
    return {
      once: (_arg) => { },
      set: (_arg) => { }
    };
  }
};

describe('LabStorageService', () => {

  let labStorageService: LabStorageService;
  let labTemplateService: LabTemplateService;
  let authService: AuthService;
  let db;
  let fbMock;

  beforeEach(() => {

    fbMock = new FirebaseMock();

    TestBed.configureTestingModule({
      providers: [
        LabStorageService,
        { provide: LabTemplateService, useClass: InMemoryLabTemplateService },
        { provide: AuthService, useValue: authServiceStub },
        { provide: DATABASE, useValue: fbMock.mockDb() },
        DbRefBuilder
      ]
    });

    labStorageService = TestBed.get(LabStorageService);
    labTemplateService = TestBed.get(LabTemplateService);
    authService = TestBed.get(AuthService);
    db = TestBed.get(DATABASE);

    let user = { uid: 'some-id' };

    spyOn(authService, 'requireAuthOnce').and.returnValue(of(user));
  });

  describe('.createLab()', () => {

    it('should create a new lab', () => {
      labStorageService.createLab().subscribe(lab => {
        expect(lab).toBeDefined();
        expect(lab.directory.length).toBe(2);
        expect(lab.directory[0].name).toEqual('main.py');
        expect(lab.directory[1].name).toEqual('ml.yaml');
        expect((<File>lab.directory[0]).content).toEqual('');
      });
    });

    it('should create new lab from existing lab (forking)', () => {

      let existingLab = Object.assign({}, LAB_STUB, { directory: [] });

      labStorageService.createLab(existingLab).subscribe(lab => {
        expect(lab).toBeDefined();
        expect(lab.id).not.toEqual(existingLab.id);
        expect(lab.name).toEqual(`Fork of ${existingLab.name}`);
        expect(lab.description).toEqual(existingLab.description);
        expect(lab.tags).toEqual(existingLab.tags);
        expect(lab.directory.length).toBe(0);
      });
    });
  });

  describe('.createLabFromTemplate()', () => {

    it('should create lab from given template', () => {

      const TEMPLATE = DEFAULT_LAB_TPL_ID;

      spyOn(labTemplateService, 'getTemplate').and.returnValue(of(LAB_TEMPLATES[TEMPLATE]));
      spyOn(labStorageService, 'createLab').and.callThrough();

      labStorageService.createLabFromTemplate(TEMPLATE).subscribe(lab => {
        expect(labTemplateService.getTemplate).toHaveBeenCalledWith(TEMPLATE);
        expect(labStorageService.createLab).toHaveBeenCalledWith(LAB_TEMPLATES[TEMPLATE]);
        expect(lab.directory.length).toBe(2);
        expect(lab.name).toEqual(`Fork of ${LAB_TEMPLATES[TEMPLATE].name}`);
        expect((<File>lab.directory[0]).content).toEqual(LAB_TEMPLATES[TEMPLATE].directory[0].content);
      });
    });
  });

  describe('.getLab()', () => {

    it('should return lab by given id', (done) => {

      fbMock.data[`labs/${LAB_STUB.id}/common`] = LAB_STUB;

      labStorageService.getLab(LAB_STUB.id)
        .subscribe(lab => {
          expect(lab).toEqual(LAB_STUB);
          done();
        });
    });
  });

  describe('.saveLab()', () => {

    it('should save lab using firebase.database.set()', (done) => {

      let expectedLab = Object.assign({}, LAB_STUB, { user_id: 'some-id', directory: [] });
      // Since `has_cached_run` is only written by the server, the
      // returned lab should actually not have this property
      delete expectedLab.has_cached_run;

      labStorageService.saveLab(expectedLab).subscribe(lab => {

        labStorageService.getLab(LAB_STUB.id)
          .subscribe(_lab => {
            // The returned lab should have its user_id changed
            expect(_lab.id).toEqual(expectedLab.id);
            expect(_lab.name).toEqual(expectedLab.name);
            expect(_lab.description).toEqual(expectedLab.description);
            expect(_lab.tags).toEqual(expectedLab.tags);
            expect(_lab.directory).toEqual(expectedLab.directory);
            done();
          });
      });

    });
  });
});

