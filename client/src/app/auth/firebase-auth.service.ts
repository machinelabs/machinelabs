import * as firebase from 'firebase';

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { map, switchMap, take, catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { LoginUser } from '../models/user';

@Injectable()
export class FirebaseAuthService extends AuthService {
  auth$: Observable<LoginUser>;

  requireAuth(): Observable<LoginUser> {
    // `onIdTokenChanged()` always returns the latest logged-in user *or* null
    // if it's the very first time. If `user` is null, we make sure to sign in anonymously
    // so that a user is always logged-in in some way.
    //
    // Use this method to subscribe to any auth changes throughout the lifecycle of
    // a user session.
    return (
      new Observable(obs => firebase.auth().onIdTokenChanged(obs))
        // We're using `switchMap()` to make sure the returned Observable is a long-living one
        // (which is not the case if we'd return `Observable.fromPromise()` straight away.
        .pipe(switchMap(user => (user ? of(user) : fromPromise(<Promise<any>>firebase.auth().signInAnonymously()))))
    );
  }

  requireAuthOnce() {
    return this.requireAuth().pipe(take(1));
  }

  refreshToken() {
    return fromPromise(<Promise<any>>firebase.auth().currentUser.getIdToken(true));
  }

  signOut(): Observable<any> {
    return fromPromise(<Promise<any>>firebase.auth().signOut());
  }

  signInWithCredential(credential: firebase.auth.AuthCredential): Observable<LoginUser> {
    const loginPromise = firebase
      .auth()
      .signInAndRetrieveDataWithCredential(credential)
      .then(result => result.user);

    return fromPromise(<Promise<any>>loginPromise);
  }

  linkOrSignInWithGitHub(): Observable<LoginUser> {
    const linkPromise = firebase.auth().currentUser.linkWithPopup(new firebase.auth.GithubAuthProvider());

    // If a user has been permanently linked/authenticated already and tries
    // to link again, firebase will throw an error. That's when we know that
    // user credentials do already exist and we can simply sign in using GitHub.
    return fromPromise(<Promise<any>>linkPromise).pipe(
      switchMap(loginUser => this.signInWithCredential(loginUser.credential)),
      catchError(error => this.signInWithCredential(error.credential))
    );
  }
}
