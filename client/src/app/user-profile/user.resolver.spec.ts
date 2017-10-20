import { MatSnackBarModule } from '@angular/material';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';

import { UserService } from '../user/user.service';
import { LabStorageService } from '../lab-storage.service';
import { UserResolver, UserLabsResolver } from './user.resolver';

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;
  let routeSnapshotStub: ActivatedRouteSnapshot;
  let router: Router;

  let routerStub = {
    navigate: (params) => {}
  };
  let userServiceStub = {
    getUser: (id: string) => {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: userServiceStub },
        { provide: Router, useValue: routerStub }
      ],
      imports: [MatSnackBarModule]
    });
    userResolver = TestBed.get(UserResolver);
    userService = TestBed.get(UserService);
    router = TestBed.get(Router);
    routeSnapshotStub = new ActivatedRouteSnapshot();
    spyOn(userService, 'getUser').and.returnValue(of(null));
    spyOn(router, 'navigate');
  });

  describe('.resolve()', () => {
    it('should resolve a user given their id', () => {
      routeSnapshotStub.params = {userId: 1};
      userResolver.resolve(routeSnapshotStub).subscribe(_ => {
        expect(userService.getUser).toHaveBeenCalledWith(1);
      });
    });

    it('should navigate to editor if requested user doesn\'t exist', () => {
      routeSnapshotStub.params = {userId: 1};
      userResolver.resolve(routeSnapshotStub).subscribe(_ => {
        expect(router.navigate).toHaveBeenCalledWith(['/editor']);
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
    spyOn(labStorage, 'getLabsFromUser').and.returnValue(of(null));
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
