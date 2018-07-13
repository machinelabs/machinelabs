import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const config = Object.assign({}, firebaseConfig, {
  databaseAuthVariableOverride: {
    uid: 'SYSTEM_USER'
  }
});

const app = admin.initializeApp(config, 'cloud-fn-assign-server');

export const database = app.database();
