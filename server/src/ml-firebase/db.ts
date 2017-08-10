import * as admin from 'firebase-admin';
import { environment } from '../environments/environment';
import { Config } from '../util/config';
import { DbRefBuilder } from '@machinelabs/core';

admin.initializeApp({
  credential: admin.credential.cert(<any>{
    'private_key': Config.getEnv(Config.ENV_PRIVATE_KEY),
    'client_email': Config.getEnv(Config.ENV_CLIENT_EMAIL),
  }),
  databaseURL: environment.firebaseConfig.databaseURL,
  databaseAuthVariableOverride: {
    uid: 'execution-server'
  }
});

export let db = admin.database();
export let dbRefBuilder = new DbRefBuilder(db);
