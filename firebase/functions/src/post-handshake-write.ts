import { database } from 'firebase-functions';
import * as admin from 'firebase-admin';

import { DataSnapshot } from 'firebase-functions/lib/providers/database';
import { Runnable, TriggerAnnotated } from 'firebase-functions/lib/cloud-functions';

export const postHandshakeCommitCreate = database.ref('/handshakes/{id}/commit/user_id').onCreate((snap, context) => {
  const userId = snap.val();
  const id = context.params.id;
  console.log(userId);
  console.log(id);
  console.log('making token');
  return admin
    .auth()
    .createCustomToken(userId)
    .catch(e => console.error(e))
    .then(token => {
      console.log('token' + token);
      return admin
        .database()
        .ref(`/handshakes/${id}/request/token`)
        .set(token);
    });
});
