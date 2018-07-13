import * as admin from 'firebase-admin';
import { database } from 'firebase-functions';

import { Change, Runnable, TriggerAnnotated } from 'firebase-functions/lib/cloud-functions';
import { DataSnapshot } from 'firebase-functions/lib/providers/database';

import { appendEntryToMonthIndex, updateUserExecutions } from './user-execution-index-tools';
import { pathify } from './util/pathify';

export const postExecutionWrite = database.ref('/executions/{id}/common').onWrite((change, context) => {
  const delta = {};
  const data = change.after.val();

  console.log(`Running post execution handler for ${data.id}`);

  updateVisibleExecutions(context, data, delta);
  updateLabExecution(context, data, delta);
  updateUserExecutions(context, data, delta);

  return admin
    .database()
    .ref(`/labs/${data.lab.id}/common`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then(lab => {
      if (
        lab.name &&
        !lab.name.toLowerCase().startsWith('fork of') &&
        !lab.name.toLowerCase().startsWith('untitled') &&
        !lab.is_private
      ) {
        updateRecentLabs(context, data, delta);
      }
    })
    .then(_ => console.log(JSON.stringify(delta)))
    .then(_ =>
      admin
        .database()
        .ref()
        .update(delta)
    );
});

function updateVisibleExecutions(context, data, delta) {
  delta[`/idx/lab_visible_executions/${data.lab.id}/${data.id}`] = data.hidden ? null : true;
  delta[`/idx/user_visible_executions/${data.user_id}/${data.id}`] = data.hidden ? null : true;
}

function updateLabExecution(context, data, delta) {
  delta[`/idx/lab_executions/${data.lab.id}/${data.id}`] = true;
}

function updateRecentLabs(context, data, delta) {
  delta[`/idx/recent_labs/${data.lab.id}`] = {
    updated_at: data.started_at,
    lab_id: data.lab.id
  };
}
