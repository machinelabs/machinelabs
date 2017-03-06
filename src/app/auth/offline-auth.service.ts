import { Injectable } from '@angular/core';

import { User } from '../models/user';
import { AuthService } from './auth.service';

import { Observable } from 'rxjs/Observable';

export let dummyUser = {
  uid: 'some unique id',
  displayName: 'Tony Stark',
  email: 'tony@starkindustries.com',
  isAnonymous: true,
  photoUrl: null
};

// We emulate the logged in user and its state of being
// anonymously authenticated or not
export interface OfflineAuth extends AuthService {
  user: User;
}

@Injectable()
export class OfflineAuthService implements OfflineAuth {

  user: User = dummyUser;

  requireAuth(): Observable<User> {
    return Observable.of(this.user);
  }

  requireAuthOnce(): Observable<User> {
    return this.requireAuth().take(1);
  }

  signInWithGitHub(): Observable<User> {
    this.user.isAnonymous = false;
    return Observable.of(this.user);
  }

  signOut(): Observable<any> {
    this.user.isAnonymous = true;
    return Observable.of();
  }
}
