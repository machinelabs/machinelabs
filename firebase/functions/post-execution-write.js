const admin = require('firebase-admin');
const functions = require('firebase-functions');
const appendIndexEntry = require('./user-execution-index-tools');
const pathify = require('./util/pathify');

module.exports = functions.database.ref('/executions/{id}/common')
  .onWrite(event => {
    let delta = {};
    const data = event.data.val();
  
    console.log(`Running post execution handler for ${data.id}`);

    updateVisibleExecutions(event, data, delta);
    updateLabExecution(event, data, delta);
    updateUserExecutions(event, data, delta);

    console.log(JSON.stringify(delta));
    return admin.database().ref().update(delta);
  });

function updateVisibleExecutions(event, data, delta) {
  delta[`/idx/lab_visible_executions/${data.lab.id}/${data.id}`] = data.hidden ? null : true;
  delta[`/idx/user_visible_executions/${data.user_id}/${data.id}`] = data.hidden ? null: true;
}

function updateLabExecution(event, data, delta) {
  delta[`/idx/lab_executions/${data.lab.id}/${data.id}`] = true;
}

function updateUserExecutions(event, data, delta) {
  if (data.started_at && data.finished_at) {
    let userIdx = {};
    let idx = {
      idx: {
        user_executions: {
          [data.user_id]: userIdx
        }
      }
    } 

    appendIndexEntry(userIdx, data.started_at, data.finished_at, data.id);
    Object.assign(delta, pathify(idx));
  }

  delta[`/idx/user_executions/${data.user_id}/live/${data.id}`] = data.finished_at ? null : true;
}
