import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { TriggerAnnotated, Event} from 'firebase-functions';
import { DeltaSnapshot } from 'firebase-functions/lib/providers/database';


import { appendEntryToMonthIndex, updateUserExecutions } from './user-execution-index-tools';
import { pathify } from './util/pathify';

export const postExecutionWrite = functions.database.ref('/executions/{id}/common')
  .onWrite(event => {
    let delta = {};
    const data = event.data.val();

    console.log(`Running post execution handler for ${data.id}`);

    updateVisibleExecutions(event, data, delta);
    updateLabExecution(event, data, delta);
    updateUserExecutions(event, data, delta);

    return admin.database().ref(`/labs/${data.lab.id}/common`)
      .once('value')
      .then(snapshot => snapshot.val())
      .then(lab => {
        if (lab.name && !lab.name.startsWith('Fork of') && !lab.is_private) {
          updateRecentLabs(event, data, delta);
        }
      })
      .then(_ => console.log(JSON.stringify(delta)))
      .then(_ => admin.database().ref().update(delta))
  });

function updateVisibleExecutions(event, data, delta) {
  delta[`/idx/lab_visible_executions/${data.lab.id}/${data.id}`] = data.hidden ? null : true;
  delta[`/idx/user_visible_executions/${data.user_id}/${data.id}`] = data.hidden ? null : true;
}

function updateLabExecution(event, data, delta) {
  delta[`/idx/lab_executions/${data.lab.id}/${data.id}`] = true;
}



function updateRecentLabs(event, data, delta) {
  delta[`/idx/recent_labs/${data.lab.id}`] = {
    'updated_at': data.started_at,
    'lab_id': data.lab.id
  };
}
