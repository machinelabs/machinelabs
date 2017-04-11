import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';
import { AuthService } from '../auth';
import { DATABASE } from '../app.tokens';
import { DbRefBuilder } from '../firebase/db-ref-builder';
import { FirebaseMock } from '../../mocks/firebase-mock';
import { Observable } from 'rxjs/Observable';

describe('UserService', () => {

  let authService: AuthService;
  let userService: UserService;
  let db;
  let fbMock;

  let loginUser = {
    uid: 'some-id',
    displayName: 'foo',
    email: 'foo@bar.de',
    isAnonymous: true,
    photoUrl: '/some/address'
  };

  let expectedUser = {
    id: 'some-id',
    displayName: 'foo',
    email: 'foo@bar.de',
    isAnonymous: true,
    photoUrl: '/some/address'
  };


  let authServiceStub = {
    requireAuth: () => new Observable(obs => obs.next(loginUser)),
    requireAuthOnce: () => Observable.of(loginUser)
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
    it(`should create a user if it doesn't exist`, (done) => {
      userService.createUserIfMissing()
                 .subscribe(() => {
                   expect(fbMock.data[`users/${loginUser.uid}`]).toEqual(expectedUser);
                   done();
                 });
    });

    it(`should not create a user if it already exist`, (done) => {
      fbMock.data[`users/${loginUser.uid}`] = 'foobar';
      userService.createUserIfMissing()
                 .subscribe(() => {
                   // if it had overwritten the user it would be the `expectedUser`
                   // and not a simple string.
                   expect(fbMock.data[`users/${loginUser.uid}`]).toEqual('foobar');
                   done();
                 });
    });
  });

  describe('saveUser()', () => {
    it(`should save the user`, (done) => {
      userService.saveUser(expectedUser)
                 .subscribe(() => {
                   expect(fbMock.data[`users/${expectedUser.id}`]).toEqual(expectedUser);
                   done();
                 });
    });
  });

  describe('getUser()', () => {
    it(`should return null if user does not exist`, (done) => {
      userService.getUser(expectedUser.id)
                 .subscribe((user) => {
                   expect(user).toBeNull();
                   done();
                 });
    });

    it(`should return the user if it exists`, (done) => {
      fbMock.data[`users/${expectedUser.id}`] = expectedUser;
      userService.getUser(expectedUser.id)
                 .subscribe((user) => {
                   expect(user).toEqual(expectedUser);
                   done();
                 });
    });
  });
});
