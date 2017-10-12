import * as firebase from 'firebase';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService} from './auth.service';
import { LoginUser } from '../models/user';

import { DbRefBuilder } from '../firebase/db-ref-builder';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/mergeMap';

export enum LinkErrorCode {
  CredentialAlreadyInUse = 'auth/credential-already-in-use'
}

export interface LinkError {
  code: LinkErrorCode;
  credential: firebase.auth.AuthCredential;
  email: string;
  message: string;
}

@Injectable()
export class FirebaseAuthService extends AuthService {

  auth$: Observable<LoginUser>;

  constructor(private db: DbRefBuilder) {
    super();
  }

  requireAuth(): Observable<LoginUser> {
    // `onAuthStateChanged()` always returns the latest logged-in user *or* null
    // if it's the very first time. If `user` is null, we make sure to sign in anonymously
    // so that a user is always logged-in in some way.
    //
    // Use this method to subscribe to any auth changes througout the lifecycle of
    // a user session.
    return new Observable(obs => firebase.auth().onAuthStateChanged(obs))
                // We're using `switchMap()` to make sure the returned Observable is a long-living one
                // (which is not the case if we'd return `Observable.fromPromise()` straight away.
                .switchMap(user => user ?
                    Observable.of(user) :
                    Observable.fromPromise(<Promise<any>>firebase.auth().signInAnonymously())
                );
  }

  requireAuthOnce() {
    return this.requireAuth().take(1);
  }

  refreshToken() {
    return Observable.fromPromise(<Promise<any>>firebase.auth().currentUser.getIdToken(true));
  }

  signOut(): Observable<any> {
    return Observable.fromPromise(<Promise<any>>firebase.auth().signOut());
  }

  signIn(provider: firebase.auth.AuthProvider): Observable<LoginUser> {
    console.log('sign in');
    let loginPromise = firebase.auth()
                               .signInWithPopup(provider)
                               .then(result => result.user);

    return Observable.fromPromise(<Promise<any>>loginPromise);
  }

  linkOrSignIn(provider: firebase.auth.AuthProvider): Observable<LoginUser> {
    // If a user has been permanentely linked/authenticated already and tries
    // to link again, firebase will throw an error. That's when we know that
    // user credentials do already exist and we can simply sign in using GitHub.
    return this.linkWithPopup(provider)
               .switchMap(loginUser  => this.refreshToken().map(_ => loginUser))
               .catch(error => this.signIn(provider));
  }

  link(provider: firebase.auth.AuthProvider) {
    return this.linkWithPopup(provider)
               .catch((error: LinkError) => this.handleLinkError(error))
  }

  linkWithPopup(provider: firebase.auth.AuthProvider): Observable<LoginUser> {
    return Observable.fromPromise(firebase.auth().currentUser.linkWithPopup(provider))
                     .map(data => data.user);
  }

  unlink(providerId: string) {
    return Observable.fromPromise(firebase.auth().currentUser.unlink(providerId));
  }

  private handleLinkError(error: LinkError) {
    if(error.code === LinkErrorCode.CredentialAlreadyInUse) {
      let prevUser = firebase.auth().currentUser;
      let credentials = error.credential;
      let handshakeId = this.db.rootRef().ref.push().key;

      return this.requestUserMerge(prevUser.uid, handshakeId, 'passive')
        .mergeMap(() => Observable.fromPromise(firebase.auth().signInWithCredential(credentials)))
        .mergeMap((user: LoginUser) => this.requestUserMerge(user.uid, handshakeId, 'active')
                                           .mapTo(user));
    } else {
      return this.auth$;
    }
  }

  private requestUserMerge(userId: string, handshakeId: string, type: 'active' | 'passive'): Observable<any> {
    return this.db.mergeRequests(userId).set({
      user_id: userId,
      handshake_id: handshakeId,
      type
    });
  }
}
