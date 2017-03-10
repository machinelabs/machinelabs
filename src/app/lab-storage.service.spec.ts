import { TestBed } from '@angular/core/testing';
import { Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LabStorageService } from './lab-storage.service';
import { AuthService } from './auth';
import { DATABASE } from './app.tokens';
import { DEFAULT_LAB_CODE } from './default-lab';

let testLab = {
  id: 'some-id',
  user_id: 'user id',
  name: 'Existing lab',
  description: '',
  tags: ['existing'],
  files: []
};

let authServiceStub = {
  requireAuthOnce: () => {}
};

let databaseStub = {
  ref: (arg) => {
    return {
      once: (arg) => {},
      set: (arg) => {}
    }
  }
};

describe('LabStorageService', () => {

  let labStorageService: LabStorageService;
  let authService: AuthService;
  let db;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LabStorageService,
        { provide: AuthService, useValue: authServiceStub },
        { provide: DATABASE, useValue: databaseStub }
      ]
    });

    labStorageService = TestBed.get(LabStorageService);
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
        expect(lab.files[0].content).toEqual(DEFAULT_LAB_CODE);
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

  describe('.getLab()', () => {

    it('should return lab by given id', (done) => {

      function ref(str) {
        return {
          once: (str) => {
            return new Promise(resolve => {
              resolve({
                val: () => {
                  return Object.assign({}, testLab);
                }
              })
            });
          }
        };
      }

      spyOn(db, 'ref').and.callFake(ref)

      labStorageService.getLab('foo').subscribe(lab => {
        expect(db.ref).toHaveBeenCalledWith('labs/foo');
        expect(lab).toEqual(testLab);
        done();
      });
    });
  });

  describe('.saveLab()', () => {

    it('should save lab using firebase.database.set()', (done) => {

      function ref(str) {
        return {
          set: (arg) => {
            return Promise.resolve(Object.assign({}, testLab));
          }
        };
      }

      spyOn(db, 'ref').and.callFake(ref)

      labStorageService.saveLab(testLab).subscribe(lab => {
        expect(db.ref).toHaveBeenCalledWith('labs/some-id');
        expect(lab).toEqual(testLab);
        done();
      });
    });
  });
});
