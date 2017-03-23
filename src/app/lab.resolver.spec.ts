import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { LabResolver } from './lab.resolver';
import { LabStorageService } from './lab-storage.service';
import { BLANK_LAB_TPL_ID, DEFAULT_LAB_TPL_ID } from './lab-template.service';

import { Lab } from './models/lab';
import { ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

describe('LabResolver', () => {

  let labResolver: LabResolver;
  let labStorageService: LabStorageService;

  let labStorageServiceStub = {
    createLab: () => {},
    createLabFromTemplate: (arg) => {},
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

    it('should resolve with new lab from default template if no route param labid is given', () => {

      let newLab: Lab = {
        id: 'new-lab',
        user_id: 'user-id',
        name: 'New Lab',
        description: 'this is a new lab',
        tags: [],
        files: []
      };

      let activatedRouteSnapshotStub =  new ActivatedRouteSnapshot();
      activatedRouteSnapshotStub.params = {};
      activatedRouteSnapshotStub.queryParams = {};
      spyOn(labStorageService, 'createLabFromTemplate').and.returnValue(Observable.of(newLab));

      labResolver.resolve(activatedRouteSnapshotStub).subscribe(lab => {
        expect(labStorageService.createLabFromTemplate).toHaveBeenCalledWith(DEFAULT_LAB_TPL_ID);
        expect(lab).toEqual(newLab);
      });
    });

    it('should resolve with blank lab, if template param for blank is given', () => {

      let newLab: Lab = {
        id: 'new-lab',
        user_id: 'user-id',
        name: 'New Lab',
        description: 'this is a new lab',
        tags: [],
        files: []
      };

      let activatedRouteSnapshotStub = new ActivatedRouteSnapshot();
      activatedRouteSnapshotStub.params = {};
      activatedRouteSnapshotStub.queryParams = { tpl: BLANK_LAB_TPL_ID }

      spyOn(labStorageService, 'createLab').and.returnValue(Observable.of(newLab));

      labResolver.resolve(activatedRouteSnapshotStub).subscribe(lab => {
        expect(labStorageService.createLab).toHaveBeenCalled();
        expect(lab).toEqual(newLab);
      });
    });

    it('should resolve with lab from template, if template param is given', () => {

      let newLab: Lab = {
        id: 'new-lab',
        user_id: 'user-id',
        name: 'New Lab',
        description: 'this is a new lab',
        tags: [],
        files: []
      };

      let activatedRouteSnapshotStub = new ActivatedRouteSnapshot();
      activatedRouteSnapshotStub.params = {};
      activatedRouteSnapshotStub.queryParams = { tpl: 'any'};

      spyOn(labStorageService, 'createLabFromTemplate').and.returnValue(Observable.of(newLab));

      labResolver.resolve(activatedRouteSnapshotStub).subscribe(lab => {
        expect(labStorageService.createLabFromTemplate).toHaveBeenCalledWith('any');
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

      let activatedRouteSnapshotStub = new ActivatedRouteSnapshot();
      activatedRouteSnapshotStub.params = { labid: 'some-id' };

      spyOn(labStorageService, 'getLab').and.returnValue(Observable.of(existingLab));

      labResolver.resolve(activatedRouteSnapshotStub).subscribe(lab => {
        expect(labStorageService.getLab)
          .toHaveBeenCalledWith(activatedRouteSnapshotStub.params['labid']);
        expect(lab).toEqual(existingLab);
      });
    });
  });
});
