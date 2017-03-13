import * as firebase from 'firebase';
import {environment} from '../../../environments/environment';
import {InjectionToken} from '@angular/core';

export const DATABASE = new InjectionToken<firebase.database.Database>('Database');

export const FIREBASE_DATABASE_PROVIDER = {
  provide: DATABASE,
  useFactory: initializeFirebaseFactory
}

export function initializeFirebaseFactory() {
  return firebase.initializeApp(environment.firebaseConfig).database();
}

