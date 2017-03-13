import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';

import { User } from '../models/user';
import { AuthService} from '../auth/auth.service';

@Injectable()
export class FirebaseAuthService extends AuthService {

  auth$: Observable<User>;

  requireAuth(): Observable<User> {
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

  signInWithGitHub(): Observable<User> {
    let loginPromise = firebase.auth()
                               .signInWithPopup(new firebase.auth.GithubAuthProvider())
                               .then(result => result.user);

    return Observable.fromPromise(<Promise<any>>loginPromise);
  }
}

