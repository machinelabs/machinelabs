const admin = require('firebase-admin');
const functions = require('firebase-functions');

module.exports = functions.database.ref('/executions/{id}/common')
  .onWrite(event => Promise.all([saveLabExecution(event), updateLabVisibleExecutions(event)]));

function saveLabExecution(event) {
  console.log('save lab execution');
  const data = event.data.val();

  return admin.database()
              .ref(`lab_executions/${data.lab.id}/${data.id}`)
              .set(true);
}

function updateLabVisibleExecutions(event) {
  console.log('update visible executions');
  const data = event.data.val();

  return !data.hidden ?
    admin.database().ref(`lab_visible_executions/${data.lab.id}/${data.id}`).set(true) :
    admin.database().ref(`lab_visible_executions/${data.lab.id}/${data.id}`).remove();
}

