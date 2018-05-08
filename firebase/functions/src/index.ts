import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as process from 'process';

export { postInvocationWrite } from './post-invocation-write';
export { postLabWrite } from './post-lab-write';
export { postExecutionWrite } from './post-execution-write';
export { bucketChange } from './uploads/add-outputs';
export { postUserCreate } from './post-user-create';
export { postHandshakeCommitCreate } from './post-handshake-write';

const conf = JSON.parse(process.env.FIREBASE_CONFIG);

const serviceAccount = functions.config().fb_service_account;

if (serviceAccount) {
  conf.credential = admin.credential.cert(<any>{
    private_key: serviceAccount.private_key,
    client_email: serviceAccount.client_email
  });
}

admin.initializeApp(conf);
