import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { LabResolver } from './lab.resolver';
import { LabStorageService } from './lab-storage.service';

import { Lab } from './models/lab';

describe('LabResolver', () => {

  let labResolver: LabResolver;
  let labStorageService: LabStorageService;

  let labStorageServiceStub = {
    createLab: () => {},
    getLab: (id) => {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LabResolver,
        { provide: LabStorageService, useValue: labStorageServiceStub }
      ]
    });

    labResolver = TestBed.get(LabResolver);
    labStorageService = TestBed.get(LabStorageService);
  });

  describe('.resolve()', () => {

    it('should resolve with new lab if no route param labid is given', () => {

      let newLab: Lab = {
        id: 'new-lab',
        user_id: 'user-id',
        name: 'New Lab',
        description: 'this is a new lab',
        tags: [],
        files: []
      };

      let activatedRouteSnapshotStub = { params: {}, data: {} };

      spyOn(labStorageService, 'createLab').and.returnValue(Observable.of(newLab));

      labResolver.resolve(activatedRouteSnapshotStub).subscribe(lab => {
        expect(labStorageService.createLab).toHaveBeenCalled();
        expect(lab).toEqual(newLab);
      });
    });

    it('should resolve with existing lab if labid is given', () => {

      let existingLab: Lab = {
        id: 'new-lab',
        user_id: 'user-id',
        name: 'New Lab',
        description: 'this is a new lab',
        tags: [],
        files: []
      };

      let activatedRouteSnapshotStub = { params: { labid: 'some-id' }, data: {} };

      spyOn(labStorageService, 'getLab').and.returnValue(Observable.of(existingLab));

      labResolver.resolve(activatedRouteSnapshotStub).subscribe(lab => {
        expect(labStorageService.getLab)
          .toHaveBeenCalledWith(activatedRouteSnapshotStub.params.labid);
        expect(lab).toEqual(existingLab);
      });
    });
  });
});
