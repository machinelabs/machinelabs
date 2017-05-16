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

function assignServer(invocation, server) {

  if (!server) {
    console.log('No matching server found: Could not assign any server');
    return Promise.resolve();
  }

  return app.database()
              .ref(`/invocations/${invocation.id}`)
              .update({
                server: {
                  id: server.id,
                  [server.id]: {
                    timestamp: invocation.timestamp
                  }
                }
              });
}

module.exports = functions.database.ref('/invocations/{id}/')
  .onWrite(event => {
    const invocation = event.data.val();

    // Setting the server will invoke the same cloud function again,
    // hence we need to break the cycle here. We could also listen for
    // a deeper node but then we would have to fetch the invocation
    // seperately.

    // Another issue is that the invocation may be null for whatever reasons
    if (!invocation || invocation.server) {
      return Promise.resolve();
    }

    return getServerForHardwareType(invocation.hardware_type || DEFAULT_HARDWARE_TYPE)
              .then(server => assignServer(invocation, server));
  });
