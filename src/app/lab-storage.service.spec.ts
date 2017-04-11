import { TestBed } from '@angular/core/testing';
import { Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LabStorageService } from './lab-storage.service';
import { LabTemplateService, InMemoryLabTemplateService, DEFAULT_LAB_TPL_ID } from './lab-template.service';
import { AuthService } from './auth';
import { DATABASE } from './app.tokens';
import { DbRefBuilder } from './firebase/db-ref-builder';
import { LAB_TEMPLATES } from './data/lab-templates';
import { FirebaseMock } from '../mocks/firebase-mock';

let testLab = {
  id: 'some-id',
  user_id: 'user id',
  name: 'Existing lab',
  description: '',
  tags: ['existing'],
  files: []
};

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

    spyOn(authService, 'requireAuthOnce').and.returnValue(Observable.of(user));
  });

  describe('.createLab()', () => {

    it('should create a new lab', () => {
      labStorageService.createLab().subscribe(lab => {
        expect(lab).toBeDefined();
        expect(lab.files.length).toBe(1);
        expect(lab.files[0].name).toEqual('main.py');
        expect(lab.files[0].content).toEqual('');
      });
    });

    it('should create new lab from existing lab (forking)', () => {

      let existingLab = Object.assign({}, testLab);

      labStorageService.createLab(existingLab).subscribe(lab => {
        expect(lab).toBeDefined();
        expect(lab.id).not.toEqual(existingLab.id);
        expect(lab.name).toEqual(`Fork of ${existingLab.name}`);
        expect(lab.description).toEqual(existingLab.description);
        expect(lab.tags).toEqual(existingLab.tags);
        expect(lab.files.length).toBe(0);
      });
    });
  });

  describe('.createLabFromTemplate()', () => {

    it('should create lab from given template', () => {

      const TEMPLATE = DEFAULT_LAB_TPL_ID;

      spyOn(labTemplateService, 'getTemplate').and.returnValue(Observable.of(LAB_TEMPLATES[TEMPLATE]));
      spyOn(labStorageService, 'createLab').and.callThrough();

      labStorageService.createLabFromTemplate(TEMPLATE).subscribe(lab => {
        expect(labTemplateService.getTemplate).toHaveBeenCalledWith(TEMPLATE);
        expect(labStorageService.createLab).toHaveBeenCalledWith(LAB_TEMPLATES[TEMPLATE]);
        expect(lab.files.length).toBe(1);
        expect(lab.name).toEqual(`Fork of ${LAB_TEMPLATES[TEMPLATE].name}`);
        expect(lab.files[0].content).toEqual(LAB_TEMPLATES[TEMPLATE].files[0].content);
      });
    });
  });

  describe('.getLab()', () => {

    it('should return lab by given id', (done) => {

      fbMock.data[`labs/${testLab.id}`] = testLab;

      labStorageService.getLab(testLab.id)
        .subscribe(lab => {
          expect(lab).toEqual(testLab);
          done();
        });
    });

    describe('.saveLab()', () => {

      it('should save lab using firebase.database.set()', (done) => {

        labStorageService.saveLab(testLab).subscribe(lab => {

          labStorageService.getLab(testLab.id)
            .subscribe(_lab => {
              // The returned lab should have its user_id changed
              expect(_lab).toEqual(Object.assign({}, testLab, { user_id: 'some-id' }));
              done();
            });
        });

      });
    });
  });
});

