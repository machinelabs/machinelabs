import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { User } from './models/user';
import { Observable } from 'rxjs/Observable';

export abstract class AuthService {
  abstract authenticate(): Observable<User>;
}

export class FirebaseAuthService {

  login$: Observable<User>

  authenticate(): Observable<User> {

    if (!this.login$) {
      this.login$ = Observable.fromPromise(new Promise(resolve => firebase.auth().onAuthStateChanged(resolve))
                                .then(user => user ? user : firebase.auth().signInAnonymously())
                              )
                              .publishLast()
                              .refCount();
    }

    return this.login$;
  }
}

export class OfflineAuthService {

  authenticate(): Observable<User> {
    const user = {
      uid: 'some unique id',
      displayName: 'Tony Stark',
      email: 'tony@starkindustries.com',
      isAnonymous: true,
      photoUrl: null
    };

    return Observable.fromPromise(new Promise(resolve => resolve(user)));
  }
}

