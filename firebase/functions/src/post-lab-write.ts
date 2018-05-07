import * as admin from 'firebase-admin';
import { database } from 'firebase-functions';

import * as crypto from 'crypto';

import { Change, Runnable, TriggerAnnotated } from 'firebase-functions/lib/cloud-functions';
import { DataSnapshot } from 'firebase-functions/lib/providers/database';

export const postLabWrite = database
  .ref('/labs/{id}/common')
  .onWrite((change, context) => Promise.all([updateIndices(change), setHasCachedRun(change, context)]));

function hashDirectory(directory) {
  const hasher = crypto.createHash('sha256');
  return hasher.update(JSON.stringify(directory)).digest('hex');
}

function updateIndices(change) {
  const delta = {};
  const data = change.after.val();

  console.log('Post lab write: updating indices');

  delta[`/idx/user_labs/${data.user_id}/${data.id}`] = true;
  delta[`/idx/user_visible_labs/${data.user_id}/${data.id}`] = data.hidden ? null : true;

  if (data.hidden || data.is_private) {
    delta[`/idx/recent_labs/${data.id}`] = null;
  }

  // We need to find all executions that are attached to this lab
  // and hide them as well.
  //
  // Notice we don't update `lab_visible_executions` because we only
  // need to hide them for the users not for the labs.
  return admin
    .database()
    .ref(`/idx/lab_executions/${data.id}`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then(val => (val ? Object.keys(val) : []))
    .then(executionIds => {
      executionIds.forEach(id => {
        delta[`/idx/user_visible_executions/${data.user_id}/${id}`] = data.hidden ? null : true;
      });
    })
    .then(_ =>
      admin
        .database()
        .ref()
        .update(delta)
    );
}

function setHasCachedRun(change, context) {
  const data = change.after.val();

  console.log(`stringify directory:
                ${JSON.stringify(data.directory)}`);

  const hash = hashDirectory(data.directory);
  console.log(`Setting hash ${hash} of lab ${context.params.id}`);

  return admin
    .database()
    .ref(`/labs/${context.params.id}/common`)
    .update({ cache_hash: hash });
}
