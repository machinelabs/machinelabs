import { Injectable } from '@angular/core';

import { LoginUser } from '../models/user';
import { AuthService } from './auth.service';

import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

export let dummyUser = {
  id: 'some unique id',
  uid: 'some unique id',
  displayName: 'Tony Stark',
  email: 'tony@starkindustries.com',
  isAnonymous: true,
  photoURL: null,
  photoUrl: null
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
    return of(this.user);
  }

  requireAuthOnce(): Observable<LoginUser> {
    return this.requireAuth().pipe(take(1));
  }

  signInWithCredential(credential: firebase.auth.AuthCredential): Observable<LoginUser> {
    this.user.isAnonymous = false;
    return of(this.user);
  }

  linkOrSignInWithGitHub(): Observable<LoginUser> {
    return this.signInWithCredential({ providerId: '', signInMethod: '' });
  }

  signOut(): Observable<any> {
    this.user.isAnonymous = true;
    return of();
  }
}
