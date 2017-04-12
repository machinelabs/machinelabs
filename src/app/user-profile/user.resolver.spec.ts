import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../user/user.service';
import { LabStorageService } from '../lab-storage.service';
import { UserResolver, UserLabsResolver } from './user.resolver';

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;
  let routeSnapshotStub: ActivatedRouteSnapshot;
  let userServiceStub = {
    getUser: (id: string) => {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserResolver,
        {provide: UserService, useValue: userServiceStub}
      ]
    });
    userResolver = TestBed.get(UserResolver);
    userService = TestBed.get(UserService);
    routeSnapshotStub = new ActivatedRouteSnapshot();
    spyOn(userService, 'getUser').and.returnValue(Observable.of(null));
  });

  describe('.resolve()', () => {
    it('should resolve a user given their id', () => {
      routeSnapshotStub.params = {userId: 1};
      userResolver.resolve(routeSnapshotStub).subscribe(_ => {
        expect(userService.getUser).toHaveBeenCalledWith(1);
      });
    });
  });
});

describe('UserLabsResolver', () => {
  let userLabsResolver: UserLabsResolver;
  let labStorage: LabStorageService;
  let routeSnapshotStub: ActivatedRouteSnapshot;
  let labStorageStub = {
    getLabsFromUser: (id: string) => {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserLabsResolver,
        {provide: LabStorageService, useValue: labStorageStub}
      ]
    });
    userLabsResolver = TestBed.get(UserLabsResolver);
    labStorage = TestBed.get(LabStorageService);
    routeSnapshotStub = new ActivatedRouteSnapshot();
    spyOn(labStorage, 'getLabsFromUser').and.returnValue(Observable.of(null));
  });

  describe('.resolve()', () => {
    it('should resolve the labs created by a user, given the user\'s id', () => {
      routeSnapshotStub.params = {userId: 2};
      userLabsResolver.resolve(routeSnapshotStub).subscribe(_ => {
        expect(labStorage.getLabsFromUser).toHaveBeenCalledWith(2);
      });
    });
  });
});
