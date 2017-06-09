const admin = require('firebase-admin');
const functions = require('firebase-functions');

module.exports = functions.database.ref('/executions/{id}/common')
  .onWrite(event => saveLabExecution(event));

function saveLabExecution(event) {
  console.log('save lab execution');
  const data = event.data.val();

  return admin.database()
              .ref(`lab_executions/${data.lab.id}/${data.id}`)
              .set(true);
}

