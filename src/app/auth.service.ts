import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { User } from './models/user';

export abstract class AuthService {
  abstract authenticate(): Promise<User>;
}

export class FirebaseAuthService {

  authenticate(): Promise<User> {
    return new Promise(resolve => firebase.auth().onAuthStateChanged(resolve))
              .then(user => user ? user : firebase.auth().signInAnonymously());
  }
}

export class OfflineAuthService {

  authenticate(): Promise<User> {
    const user = {
      uid: 'some unique id',
      displayName: 'Tony Stark',
      email: 'tony@starkindustries.com',
      isAnonymous: true,
      photoUrl: null
    };

    return new Promise(resolve => resolve(user));
  }
}

