import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { UserService } from '../user/user.service';
import { LabStorageService } from '../lab-storage.service';
import { UserResolver, UserLabsResolver } from './user.resolver';
import { SnackbarService } from '../snackbar.service';

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;
  let routeSnapshotStub: ActivatedRouteSnapshot;
  let router: Router;

  const routerStub = {
    navigate: params => {}
  };
  const userServiceStub = {
    getUser: (id: string) => {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserResolver,
        SnackbarService,
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
      routeSnapshotStub.params = { userId: 1 };
      userResolver.resolve(routeSnapshotStub).subscribe(_ => {
        expect(userService.getUser).toHaveBeenCalledWith(1);
      });
    });

    it("should navigate to editor if requested user doesn't exist", () => {
      routeSnapshotStub.params = { userId: 1 };
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
  const labStorageStub = {
    getLabsFromUser: (id: string) => {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserLabsResolver, SnackbarService, { provide: LabStorageService, useValue: labStorageStub }],
      imports: [MatSnackBarModule]
    });
    userLabsResolver = TestBed.get(UserLabsResolver);
    labStorage = TestBed.get(LabStorageService);
    routeSnapshotStub = new ActivatedRouteSnapshot();
    spyOn(labStorage, 'getLabsFromUser').and.returnValue(of(null));
  });

  describe('.resolve()', () => {
    it("should resolve the labs created by a user, given the user's id", () => {
      routeSnapshotStub.params = { userId: 2 };
      userLabsResolver.resolve(routeSnapshotStub).subscribe(_ => {
        expect(labStorage.getLabsFromUser).toHaveBeenCalledWith(2);
      });
    });
  });
});
