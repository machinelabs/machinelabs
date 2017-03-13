import { Observable } from 'rxjs/Observable';
import { TestBed } from '@angular/core/testing';

import { LabResolver } from './lab.resolver';
import { LabStorageService } from './lab-storage.service';
import { Lab } from '../models/lab';

xdescribe('LabResolver', () => {

  let labResolver: LabResolver;
  let labStorageService: LabStorageService;

  let labStorageServiceStub = {
    createLab: () => {},
    createLabFromTemplate: (arg) => {},
    getLab: (id) => { }
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
    let newLab : Lab;
    beforeEach(()=>{
      newLab = {
        id: 'new-lab',
        user_id: 'user-id',
        name: 'New Lab',
        description: 'this is a new lab',
        tags: [],
        files: []
      };
    })

    it('should resolve with new lab from template if no route param labid is given', () => {
      let stub = { params: {}, data: {} };

      spyOn(labStorageService, 'createLabFromTemplate').and.returnValue(Observable.of(newLab));

      labResolver.resolve(stub).subscribe(lab => {
        expect(labStorageService.createLabFromTemplate).toHaveBeenCalled();
        expect(lab).toEqual(newLab);
      });
    });

    it('should resolve with existing lab if labid is given', () => {
      let existingLab = Object.assign({ }, newLab, { id : 'some-id'});
      let stub  = { params: { id : 'some-id'}, data: {} };

      spyOn(labStorageService, 'getLab').and.returnValue(Observable.of(existingLab));

      labResolver.resolve(stub).subscribe(lab => {
        expect(labStorageService.getLab).toHaveBeenCalledWith(stub.params.labid);
        expect(lab).toEqual(existingLab);
      });
    });
  });
});
