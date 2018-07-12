import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';
import { AuthService } from '../auth';
import { DATABASE } from '../app.tokens';
import { DbRefBuilder } from '../firebase/db-ref-builder';
import { FirebaseMock } from '../../test-helper/firebase-mock';
import { Observable, of } from 'rxjs';

describe('UserService', () => {
  let authService: AuthService;
  let userService: UserService;
  let db;
  let fbMock;

  const loginUser = {
    uid: 'some-id',
    displayName: 'foo',
    email: 'foo@bar.de',
    isAnonymous: true,
    photoURL: '/some/address'
  };

  const expectedUser = {
    id: 'some-id',
    displayName: 'foo',
    email: 'foo@bar.de',
    bio: '',
    isAnonymous: true,
    photoUrl: '/some/address'
  };

  const authServiceStub = {
    requireAuth: () => new Observable(obs => obs.next(loginUser)),
    requireAuthOnce: () => of(loginUser)
  };

  beforeEach(() => {
    fbMock = new FirebaseMock();

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AuthService, useValue: authServiceStub },
        { provide: DATABASE, useValue: fbMock.mockDb() },
        DbRefBuilder
      ]
    });

    authService = TestBed.get(AuthService);
    userService = TestBed.get(UserService);
    db = TestBed.get(DATABASE);
  });

  describe('createUserIfMissing()', () => {
    it(`should create a user if it doesn't exist`, done => {
      userService.createUserIfMissing().subscribe(() => {
        expect(fbMock.data[`users/${loginUser.uid}/common`]).toEqual(expectedUser);
        done();
      });
    });

    it(`should not create a user if it already exist`, done => {
      const existingUser = Object.assign({}, expectedUser);
      fbMock.data[`users/${loginUser.uid}/common`] = existingUser;
      userService.createUserIfMissing().subscribe(() => {
        // if it had overwritten the user it would be the `expectedUser`
        // and not the `existingUser`
        expect(fbMock.data[`users/${loginUser.uid}/common`]).toEqual(existingUser);
        done();
      });
    });

    it(`should patch up the user when the LoginUser has changed`, done => {
      const existingUser = Object.assign({}, expectedUser);
      existingUser.isAnonymous = false;
      fbMock.data[`users/${loginUser.uid}/common`] = existingUser;
      userService.createUserIfMissing().subscribe(() => {
        expect(fbMock.data[`users/${loginUser.uid}/common`]).toEqual(expectedUser);
        done();
      });
    });
  });

  describe('saveUser()', () => {
    it(`should save the user`, done => {
      userService.saveUser(expectedUser).subscribe(() => {
        expect(fbMock.data[`users/${expectedUser.id}/common`]).toEqual(expectedUser);
        done();
      });
    });
  });

  describe('getUser()', () => {
    it(`should return null if user does not exist`, done => {
      userService.getUser(expectedUser.id).subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });

    it(`should return the user if it exists`, done => {
      fbMock.data[`users/${expectedUser.id}/common`] = expectedUser;
      userService.getUser(expectedUser.id).subscribe(user => {
        expect(user).toEqual(expectedUser);
        done();
      });
    });
  });
});
