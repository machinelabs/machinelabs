import * as firebase from 'firebase';
import { environment } from '../environments/environment';

export const db = this.db = firebase.initializeApp(environment.firebaseConfig).database();