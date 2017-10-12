import { Injectable } from '@angular/core';

import { LoginUser } from '../models/user';
import { AuthService } from './auth.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export let dummyUser = {
  id: 'some unique id',
  uid: 'some unique id',
  displayName: 'Tony Stark',
  email: 'tony@starkindustries.com',
  isAnonymous: true,
  photoURL: null,
  photoUrl: null,
};

// We emulate the logged in user and its state of being
// anonymously authenticated or not
export interface OfflineAuth extends AuthService {
  user: LoginUser;
}

@Injectable()
export class OfflineAuthService implements OfflineAuth {
  user: LoginUser = dummyUser;

  requireAuth(): Observable<LoginUser> {
    return Observable.of(this.user);
  }

  requireAuthOnce(): Observable<LoginUser> {
    return this.requireAuth().take(1);
  }

  signIn(): Observable<LoginUser> {
    this.user.isAnonymous = false;
    return Observable.of(this.user);
  }

  linkOrSignIn(): Observable<LoginUser> {
    return this.signIn();
  }

  linkWithPopup(provider: firebase.auth.AuthProvider): Observable<LoginUser> {
    this.user.isAnonymous = false;
    return Observable.of(this.user);
  }

  link(): Observable<LoginUser> {
    return Observable.of(this.user);
  }

  unlink() {
    return Observable.of(this.user);
  }

  signOut(): Observable<any> {
    this.user.isAnonymous = true;
    return Observable.of();
  }
}
