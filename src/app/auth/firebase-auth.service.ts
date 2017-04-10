import * as firebase from 'firebase';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService} from './auth.service';
import { LoginUser } from '../models/user';

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
                              .then(result => {
                                // `linkWithPopup()` doesn't actually update the top-level properties
                                // of the authenticated user object. It only adds `providerData` for the
                                // dedicated provider (GitHub) to that object. This is because it's possible
                                // to link an account with multiple providers. If we want `user.photoURL`
                                // to be defined, we have to assign that value explicitely from the retreived
                                // `providerData`.
                                //
                                // More info: http://stackoverflow.com/questions/42766440/why-does-firebase-linkwithpopup-not-set-the-user-photourl-in-firebase
                                let currentUser = firebase.auth().currentUser;
                                currentUser.updateProfile({
                                  displayName: currentUser.providerData[0].displayName,
                                  photoURL: currentUser.providerData[0].photoURL
                                });
                                return currentUser;
                              });

    // If a user has been permanentely linked/authenticated already and tries
    // to link again, firebase will throw an error. That's when we know that
    // user credentials do already exist and we can simply sign in using GitHub.
    return Observable.fromPromise(<Promise<any>>linkPromise).catch(error => this.signInWithGitHub());
  }
}

