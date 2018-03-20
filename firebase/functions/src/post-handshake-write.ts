import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { TriggerAnnotated, Event } from 'firebase-functions';
import { DeltaSnapshot } from 'firebase-functions/lib/providers/database';

export const postHandshakeCommitCreate = functions.database.ref('/handshakes/{id}/commit/user_id').onCreate(event => {
  const userId = event.data.val();
  const id = event.params.id;
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
