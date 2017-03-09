import * as firebase from 'firebase';
import { environment } from '../../environments/environment.test';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';

import {
  AuthService,
  FirebaseAuthService,
  OfflineAuthService,
  OfflineAuth,
  dummyUser
} from './index';

import { User } from '../models/user';

describe('Auth services', () => {

  let firebaseApp;

  beforeEach(() => {
    firebaseApp = firebase.initializeApp(environment.firebaseConfig);
  });

  afterEach(done => {
    firebaseApp.delete().then(done, done.fail);
  });

  describe('FirebaseAuthService', () => {

    let authService: FirebaseAuthService;
    let user: User = dummyUser;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: AuthService, useClass: FirebaseAuthService }]
      });

      authService = TestBed.get(AuthService);
    });

    describe('.requireAuth()', () => {

      it('should authenticate anonymous user', (done) => {

        spyOn(firebase.auth(), 'onAuthStateChanged').and.callFake(obs => obs.next(null));
        spyOn(firebase.auth(), 'signInAnonymously').and.returnValue(Promise.resolve(dummyUser));

        authService.requireAuth().subscribe(user => {
          expect(firebase.auth().onAuthStateChanged).toHaveBeenCalled();
          expect(firebase.auth().signInAnonymously).toHaveBeenCalled();
          expect(user.uid).toEqual(dummyUser.uid);
          expect(user.displayName).toEqual(dummyUser.displayName);
          expect(user.email).toEqual(dummyUser.email);
          expect(user.isAnonymous).toBe(true);
          done();
        });
      });

      it('should authenticate existing user', () => {
        spyOn(firebase.auth(), 'onAuthStateChanged').and.callFake(obs => obs.next(dummyUser));
        spyOn(firebase.auth(), 'signInAnonymously');

        authService.requireAuth().subscribe(user => {
          expect(firebase.auth().onAuthStateChanged).toHaveBeenCalled();
          expect(firebase.auth().signInAnonymously).not.toHaveBeenCalled();
          expect(user.uid).toEqual(dummyUser.uid);
          expect(user.displayName).toEqual(dummyUser.displayName);
          expect(user.email).toEqual(dummyUser.email);
          expect(user.isAnonymous).toBe(true);
        });
      });
    });

    describe('.requireAuthOnce()', () => {

      it('should emit authenticated user only once', () => {

        let authObserver = null;
        let counter = 0;

        spyOn(firebase.auth(), 'onAuthStateChanged').and.callFake(obs => {
          authObserver = obs;
        });
        spyOn(firebase.auth(), 'signInAnonymously');

        authService.requireAuthOnce().subscribe(_=> {
          counter++;
        });

        authObserver.next(dummyUser);
        expect(counter).toBe(1);

        authObserver.next(dummyUser);
        expect(counter).toBe(1);
      });
    });

    describe('.signOut()', () => {

      it('should sign out emit with void when called', (done) => {

        spyOn(firebase.auth(), 'signOut').and.returnValue(Promise.resolve());

        authService.signOut().subscribe(() => {
          expect(firebase.auth().signOut).toHaveBeenCalled();
          done();
        });
      });
    });

    describe('.signInWithGitHub()', () => {

      it('should authenticate a non anonymous user', (done) => {

        let result = { user: Object.assign({}, dummyUser) };
        result.user.isAnonymous = false;

        spyOn(firebase.auth(), 'signInWithPopup').and.returnValue(Promise.resolve(result));

        authService.signInWithGitHub().subscribe(user => {
          expect(firebase.auth().signInWithPopup).toHaveBeenCalledWith(new firebase.auth.GithubAuthProvider());
          expect(user.uid).toEqual(dummyUser.uid);
          expect(user.displayName).toEqual(dummyUser.displayName);
          expect(user.email).toEqual(dummyUser.email);
          expect(user.isAnonymous).toBe(false);
          done();
        });
      });
    });
  });

  describe('OfflineAuthService', () => {

    let authService: OfflineAuth;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: AuthService, useClass: OfflineAuthService }]
      });

      authService = TestBed.get(AuthService);
    });

    afterEach(() => {
      authService.user.isAnonymous = true;
    });

    describe('.requireAuth()', () => {

      it('should resolve with anonymous dummy User object', () => {
        authService.requireAuth().subscribe(user => {
          expect(user).toBeDefined();
          expect(user.displayName).toEqual('Tony Stark');
          expect(user.email).toEqual('tony@starkindustries.com');
          expect(user.isAnonymous).toBe(true);
          expect(user.photoUrl).toBe(null);
        });
      });
    });

    describe('.requireAuthOnce()', () => {

      it('should emit authenticated user only once', () => {

        let authObserver = new Subject();
        let counter = 0;

        spyOn(authService, 'requireAuth').and.callFake(_ => {
          return authObserver.asObservable();
        });

        authService.requireAuthOnce().subscribe(_=> {
          counter++;
        });

        authObserver.next(dummyUser);
        expect(counter).toBe(1);

        authObserver.next(dummyUser);
        expect(counter).toBe(1);
      });
    });

    describe('.singInWithGitHub()', () => {

      it('should resolve with non-anonymous dummy user object', () => {
        authService.signInWithGitHub().subscribe(user => {
          expect(user).toBeDefined();
          expect(user.displayName).toEqual('Tony Stark');
          expect(user.email).toEqual('tony@starkindustries.com');
          expect(user.isAnonymous).toBe(false);
          expect(user.photoUrl).toBe(null);
        });
      });
    });

    describe('.signOut()', () => {

      it('should emit and make dummy user anonymous', () => {
        authService.user.isAnonymous = false;
        authService.signOut().subscribe(_ => {
          expect(authService.user.isAnonymous).toBe(true);
        });
      });
    });
  });
});
