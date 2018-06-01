import * as firebase from 'firebase';
import { environment } from '../../environments/environment.test';
import { TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';

import { AuthService, FirebaseAuthService, OfflineAuthService, OfflineAuth, dummyUser } from './index';

import { LoginUser } from '../models/user';

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
    const user: LoginUser = dummyUser;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: AuthService, useClass: FirebaseAuthService }]
      });

      authService = TestBed.get(AuthService);
    });

    describe('.requireAuth()', () => {
      it('should authenticate anonymous user', done => {
        spyOn(firebase.auth(), 'onIdTokenChanged').and.callFake(obs => obs.next(null));
        spyOn(firebase.auth(), 'signInAnonymously').and.returnValue(Promise.resolve(dummyUser));

        authService.requireAuth().subscribe(loginUser => {
          expect(firebase.auth().onIdTokenChanged).toHaveBeenCalled();
          expect(firebase.auth().signInAnonymously).toHaveBeenCalled();
          expect(loginUser.uid).toEqual(dummyUser.uid);
          expect(loginUser.displayName).toEqual(dummyUser.displayName);
          expect(loginUser.email).toEqual(dummyUser.email);
          expect(loginUser.isAnonymous).toBe(true);
          done();
        });
      });

      it('should authenticate existing user', () => {
        spyOn(firebase.auth(), 'onIdTokenChanged').and.callFake(obs => obs.next(dummyUser));
        spyOn(firebase.auth(), 'signInAnonymously');

        authService.requireAuth().subscribe(loginUser => {
          expect(firebase.auth().onIdTokenChanged).toHaveBeenCalled();
          expect(firebase.auth().signInAnonymously).not.toHaveBeenCalled();
          expect(loginUser.uid).toEqual(dummyUser.uid);
          expect(loginUser.displayName).toEqual(dummyUser.displayName);
          expect(loginUser.email).toEqual(dummyUser.email);
          expect(loginUser.isAnonymous).toBe(true);
        });
      });
    });

    describe('.requireAuthOnce()', () => {
      it('should emit authenticated user only once', () => {
        let authObserver = null;
        let counter = 0;

        spyOn(firebase.auth(), 'onIdTokenChanged').and.callFake(obs => {
          authObserver = obs;
        });
        spyOn(firebase.auth(), 'signInAnonymously');

        authService.requireAuthOnce().subscribe(_ => {
          counter++;
        });

        authObserver.next(dummyUser);
        expect(counter).toBe(1);

        authObserver.next(dummyUser);
        expect(counter).toBe(1);
      });
    });

    describe('.signOut()', () => {
      it('should sign out emit with void when called', done => {
        spyOn(firebase.auth(), 'signOut').and.returnValue(Promise.resolve());

        authService.signOut().subscribe(() => {
          expect(firebase.auth().signOut).toHaveBeenCalled();
          done();
        });
      });
    });

    describe('.signInWithCredential()', () => {
      it('should authenticate a non anonymous user', done => {
        const result = { user: Object.assign({}, dummyUser) };
        result.user.isAnonymous = false;

        spyOn(firebase.auth(), 'signInAndRetrieveDataWithCredential').and.returnValue(Promise.resolve(result));

        authService.signInWithCredential({ providerId: '', signInMethod: '' }).subscribe(loginUser => {
          expect(firebase.auth().signInAndRetrieveDataWithCredential).toHaveBeenCalled();
          expect(loginUser.uid).toEqual(dummyUser.uid);
          expect(loginUser.displayName).toEqual(dummyUser.displayName);
          expect(loginUser.email).toEqual(dummyUser.email);
          expect(loginUser.isAnonymous).toBe(false);
          done();
        });
      });
    });

    describe('.linkOrSignInWithGitHub()', () => {
      it('should link anonymous user with GitHub user using firebase APIs', done => {
        const result = { user: Object.assign({}, dummyUser) };
        const currentUserStub = {
          currentUser: {
            linkWithPopup: jasmine.createSpy('linkWithPopup').and.returnValue(Promise.resolve(result)),
            updateProfile: jasmine.createSpy('updateProfile').and.callFake(() => {})
          },
          signInAndRetrieveDataWithCredential: jasmine
            .createSpy('signInAndRetrieveDataWithCredential')
            .and.returnValue(Promise.resolve(result))
        };

        spyOn(firebase, 'auth').and.returnValue(currentUserStub);

        authService.linkOrSignInWithGitHub().subscribe(loginUser => {
          expect(firebase.auth().currentUser.linkWithPopup).toHaveBeenCalledWith(
            new firebase.auth.GithubAuthProvider()
          );
          expect(loginUser).toEqual(dummyUser);
          done();
        });
      });

      it('should sign in with GitHub if linking throws', done => {
        const result = { user: Object.assign({}, dummyUser) };

        const currentUserStub = {
          currentUser: {
            linkWithPopup: jasmine.createSpy('linkWithPopup').and.returnValue(Promise.reject(new Error()))
          },
          signInAndRetrieveDataWithCredential: jasmine
            .createSpy('signInAndRetrieveDataWithCredential')
            .and.returnValue(Promise.resolve(result))
        };

        spyOn(firebase, 'auth').and.returnValue(currentUserStub);

        authService.linkOrSignInWithGitHub().subscribe(loginUser => {
          expect(firebase.auth().signInAndRetrieveDataWithCredential).toHaveBeenCalled();
          expect(loginUser).toEqual(dummyUser);
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
          expect(user.photoURL).toBe(null);
        });
      });
    });

    describe('.requireAuthOnce()', () => {
      it('should emit authenticated user only once', () => {
        const authObserver = new Subject();
        let counter = 0;

        spyOn(authService, 'requireAuth').and.callFake(_ => {
          return authObserver.asObservable();
        });

        authService.requireAuthOnce().subscribe(_ => {
          counter++;
        });

        authObserver.next(dummyUser);
        expect(counter).toBe(1);

        authObserver.next(dummyUser);
        expect(counter).toBe(1);
      });
    });

    describe('.linkOrSignInWithGithub()', () => {
      it('should resolve with non-anonymous dummy user object', () => {
        authService.linkOrSignInWithGitHub().subscribe(user => {
          expect(user).toBeDefined();
          expect(user.displayName).toEqual('Tony Stark');
          expect(user.email).toEqual('tony@starkindustries.com');
          expect(user.isAnonymous).toBe(false);
          expect(user.photoURL).toBe(null);
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
