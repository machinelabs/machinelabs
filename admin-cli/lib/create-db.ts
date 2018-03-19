import * as admin from 'firebase-admin';

export function createDb(fbPrivateKey: string, fbClientEmail: string, fbDatabaseUrl: string) {
  admin.initializeApp({
    credential: admin.credential.cert(<any>{
      private_key: fbPrivateKey,
      client_email: fbClientEmail
    }),
    databaseURL: fbDatabaseUrl
  });

  return admin.database();
}
