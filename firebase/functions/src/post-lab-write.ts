import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { TriggerAnnotated, Event} from 'firebase-functions';
import { DeltaSnapshot } from 'firebase-functions/lib/providers/database';

import * as crypto from 'crypto';


export const postLabWrite = functions.database.ref('/labs/{id}/common')
  .onWrite(event => Promise.all([updateIndices(event), setHasCachedRun(event)]));

function hashDirectory(directory) {
  const hasher = crypto.createHash('sha256');
  return hasher.update(JSON.stringify(directory)).digest('hex');
}

function updateIndices(event) {
  let delta = {};
  const data = event.data.val();

  console.log('Post lab write: updating indices');

  delta[`/idx/user_labs/${data.user_id}/${data.id}`] = true;
  delta[`/idx/user_visible_labs/${data.user_id}/${data.id}`] = data.hidden ? null : true;


  // We need to find all executions that are attached to this lab
  // and hide them as well.
  //
  // Notice we don't update `lab_visible_executions` because we only
  // need to hide them for the users not for the labs.
  return admin.database().ref('executions')
    .orderByChild('common/lab/id')
    .equalTo(data.id)
    .once('value')
    .then(snapshot => snapshot.val())
    .then(val => val ? Object.keys(val) : [])
    .then(executionIds => {
      executionIds.forEach(id => {
        delta[`/idx/user_visible_executions/${data.user_id}/${id}`] = data.hidden ? null : true;
      });
    })
    .then(_ => admin.database().ref().update(delta));
}

function setHasCachedRun(event) {
  const data = event.data.val();

  console.log(`stringify directory:
                ${JSON.stringify(data.directory)}`);

  const hash = hashDirectory(data.directory);
  console.log(`Setting hash ${hash} of lab ${event.params.id}`);

  return admin.database()
    .ref(`/labs/${event.params.id}/common`)
    .update({ 'cache_hash': hash });
}
