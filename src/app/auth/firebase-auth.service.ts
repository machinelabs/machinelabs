import * as firebase from 'firebase';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService} from './auth.service';
import { LoginUser } from '../models/user';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/catch';

@Injectable()
export class FirebaseAuthService extends AuthService {

  auth$: Observable<LoginUser>;

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
    return Observable.fromPromise(<Promise<any>>firebase.auth().currentUser.getToken(true));
  }

  signOut(): Observable<any> {
    return Observable.fromPromise(<Promise<any>>firebase.auth().signOut());
  }

  signInWithGitHub(): Observable<LoginUser> {
    let loginPromise = firebase.auth()
                               .signInWithPopup(new firebase.auth.GithubAuthProvider())
                               .then(result => result.user);

    return Observable.fromPromise(<Promise<any>>loginPromise);
  }

  linkOrSignInWithGitHub(): Observable<LoginUser> {
    let linkPromise = firebase.auth()
                              .currentUser
                              .linkWithPopup(new firebase.auth.GithubAuthProvider())
                              .then(data => data.user);

    // If a user has been permanentely linked/authenticated already and tries
    // to link again, firebase will throw an error. That's when we know that
    // user credentials do already exist and we can simply sign in using GitHub.
    return Observable.fromPromise(<Promise<any>>linkPromise)
                     .switchMap(loginUser  => this.refreshToken().map(_ => loginUser))
                     .catch(error => this.signInWithGitHub());

  }
}

