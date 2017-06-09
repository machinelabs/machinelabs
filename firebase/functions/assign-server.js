const admin = require('firebase-admin');
const functions = require('firebase-functions');
const toArray = require('lodash.toarray');
const sample = require('lodash.sample');

const DEFAULT_HARDWARE_TYPE = 'economy';

let config = Object.assign({}, functions.config().firebase, {
    databaseAuthVariableOverride: {
      uid: 'cloud-fn-assign-server'
    }
  });

let app = admin.initializeApp(config, 'cloud-fn-assign-server');

function getServerForHardwareType(hardwareType) {
  return app.database()
       .ref('servers')
       .orderByChild('hardware_type')
       .equalTo(hardwareType)
       .once('value')
       .then(snapshot => snapshot.val())
       // pick a random server
       .then(val => sample(toArray(val)));
}

function getServerIdFromExecution(executionId) {
  return app.database()
            .ref(`executions/${executionId}/common`)
            .once('value')
            .then(snapshot => snapshot.val())
            .then(val => val ? val.server_id : null);
}

function assignServer(invocation, serverId) {

  if (!serverId) {
    console.log('No matching server found: Could not assign any server');
    return Promise.resolve();
  }

  return app.database()
              .ref(`/invocations/${invocation.id}`)
              .update({
                server: {
                  id: serverId,
                  [serverId]: {
                    timestamp: invocation.timestamp
                  }
                }
              });
}

module.exports = functions.database.ref('/invocations/{id}/')
  .onWrite(event => {
    const invocationWrapper = event.data.val();

    // Setting the server will invoke the same cloud function again,
    // hence we need to break the cycle here. We could also listen for
    // a deeper node but then we would have to fetch the invocation
    // seperately.

    // Another issue is that the invocation may be null for whatever reasons
    if (!invocationWrapper || invocationWrapper.server) {
      return Promise.resolve();
    }

    const invocation = invocationWrapper.common;

    // Stop Invocation needs to have the server assigned where the execution
    // is running on
    if (invocation.data.executionId){
      return getServerIdFromExecution(invocation.data.execution_id)
              .then(serverId => assignServer(invocation, serverId));
    }
    // Start Invocation gets a random server assigned
    else {
      return getServerForHardwareType(invocation.hardware_type || DEFAULT_HARDWARE_TYPE)
              .then(server => assignServer(invocation, server.id));
    }
  });
