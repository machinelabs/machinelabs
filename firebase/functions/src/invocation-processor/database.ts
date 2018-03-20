import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const config = Object.assign({}, functions.config().firebase, {
  databaseAuthVariableOverride: {
    uid: 'SYSTEM_USER'
  }
});

const app = admin.initializeApp(config, 'cloud-fn-assign-server');

export const database = app.database();
