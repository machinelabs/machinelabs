import { TestBed, inject } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';

import { of } from 'rxjs';

import { LabResolver } from './lab.resolver';
import { LabStorageService } from './lab-storage.service';
import { SnackbarService } from './snackbar.service';
import { BLANK_LAB_TPL_ID, DEFAULT_LAB_TPL_ID } from './lab-template.service';

import { Lab } from './models/lab';
import { ActivatedRouteSnapshot, UrlSegment, Router } from '@angular/router';
import { ROUTER_STUB } from '../test-helper/stubs/router.stubs';
import { LAB_STUB } from '../test-helper/stubs/lab.stubs';

describe('LabResolver', () => {
  let labResolver: LabResolver;
  let labStorageService: LabStorageService;
  let router: Router;

  const labStorageServiceStub = {
    createLab: () => {},
    createLabFromTemplate: arg => {},
    getLab: id => {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LabResolver,
        SnackbarService,
        { provide: LabStorageService, useValue: labStorageServiceStub },
        { provide: Router, useValue: ROUTER_STUB }
      ],
      imports: [MatSnackBarModule]
    });

    labResolver = TestBed.get(LabResolver);
    labStorageService = TestBed.get(LabStorageService);
    router = TestBed.get(Router);
  });

  describe('.resolve()', () => {
    it('should resolve with new lab from default template if no route param id is given', () => {
      const newLab = Object.assign({}, LAB_STUB);

      const activatedRouteSnapshotStub = new ActivatedRouteSnapshot();
      activatedRouteSnapshotStub.params = {};
      activatedRouteSnapshotStub.queryParams = {};
      spyOn(labStorageService, 'createLabFromTemplate').and.returnValue(of(newLab));

      labResolver.resolve(activatedRouteSnapshotStub).subscribe(lab => {
        expect(labStorageService.createLabFromTemplate).toHaveBeenCalledWith(DEFAULT_LAB_TPL_ID);
        expect(lab).toEqual(newLab);
      });
    });

    it('should resolve with blank lab, if template param for blank is given', () => {
      const newLab = Object.assign({}, LAB_STUB);

      const activatedRouteSnapshotStub = new ActivatedRouteSnapshot();
      activatedRouteSnapshotStub.params = {};
      activatedRouteSnapshotStub.queryParams = { tpl: BLANK_LAB_TPL_ID };

      spyOn(labStorageService, 'createLab').and.returnValue(of(newLab));

      labResolver.resolve(activatedRouteSnapshotStub).subscribe(lab => {
        expect(labStorageService.createLab).toHaveBeenCalled();
        expect(lab).toEqual(newLab);
      });
    });

    it('should resolve with lab from template, if template param is given', () => {
      const newLab = Object.assign({}, LAB_STUB);

      const activatedRouteSnapshotStub = new ActivatedRouteSnapshot();
      activatedRouteSnapshotStub.params = {};
      activatedRouteSnapshotStub.queryParams = { tpl: 'any' };

      spyOn(labStorageService, 'createLabFromTemplate').and.returnValue(of(newLab));

      labResolver.resolve(activatedRouteSnapshotStub).subscribe(lab => {
        expect(labStorageService.createLabFromTemplate).toHaveBeenCalledWith('any');
        expect(lab).toEqual(newLab);
      });
    });

    it('should resolve with existing lab if id is given', () => {
      const existingLab = Object.assign({}, LAB_STUB);

      const activatedRouteSnapshotStub = new ActivatedRouteSnapshot();
      activatedRouteSnapshotStub.params = { id: 'some-id' };

      spyOn(labStorageService, 'getLab').and.returnValue(of(existingLab));

      labResolver.resolve(activatedRouteSnapshotStub).subscribe(lab => {
        expect(labStorageService.getLab).toHaveBeenCalledWith(activatedRouteSnapshotStub.params['id']);
        expect(lab).toEqual(existingLab);
      });
    });

    it('should redirect if id is given but resolves to non-existing or hidden lab', () => {
      const activatedRouteSnapshotStub = new ActivatedRouteSnapshot();
      activatedRouteSnapshotStub.params = { id: 'some-id' };

      spyOn(labStorageService, 'getLab').and.returnValue(of(null));
      spyOn(router, 'navigate');

      labResolver.resolve(activatedRouteSnapshotStub).subscribe(lab => {
        expect(router.navigate).toHaveBeenCalledWith(['/editor']);
      });
    });
  });
});
