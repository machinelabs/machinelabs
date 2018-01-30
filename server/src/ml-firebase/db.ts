import * as admin from 'firebase-admin';
import { environment } from '../environments/environment';
import { Config } from '../util/config';
import { DbRefBuilder } from '@machinelabs/core';
import { SYSTEM_USER } from '@machinelabs/models';
import { credential } from 'firebase-admin';

let privateKey = Config.tryGetEnv(Config.ENV_PRIVATE_KEY);
let clientEmail = Config.tryGetEnv(Config.ENV_CLIENT_EMAIL);

let credentials = { getAccessToken: () => <any>{} };

if (privateKey && clientEmail) {
  credentials = admin.credential.cert(<any>{
    'private_key': privateKey,
    'client_email': clientEmail
  });
}

admin.initializeApp({
  credential: credentials,
  databaseURL: environment.firebaseConfig.databaseURL,
  databaseAuthVariableOverride: {
    uid: SYSTEM_USER
  }
});

export let db = admin.database();
export let dbRefBuilder = new DbRefBuilder(db);
