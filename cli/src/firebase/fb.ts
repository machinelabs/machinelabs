import * as firebase from 'firebase';
import { DbRefBuilder } from '@machinelabs/core';
import { environment } from '../environments/environment';

firebase.initializeApp(environment.firebaseConfig);

export const db = firebase.database();

export const refBuilder = new DbRefBuilder(db);
