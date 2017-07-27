import * as admin  from 'firebase-admin';
import * as functions from 'firebase-functions';
import { TriggerAnnotated, Event} from 'firebase-functions';
import { DeltaSnapshot } from 'firebase-functions/lib/providers/database';


import * as toArray from 'lodash.toarray';
import * as sample from 'lodash.sample';
import { InvocationWriter } from './invocation-writer';

const DEFAULT_HARDWARE_TYPE = 'economy';

let config = Object.assign({}, functions.config().firebase, {
    databaseAuthVariableOverride: {
      uid: 'cloud-fn-assign-server'
    }
  });

let app = admin.initializeApp(config, 'cloud-fn-assign-server');

function getServerIdForHardwareType(hardwareType) {
  return app.database()
       .ref('servers')
       .orderByChild('hardware_type')
       .equalTo(hardwareType)
       .once('value')
       .then(snapshot => snapshot.val())
       // pick a random server
       .then(val => sample(toArray(val)))
       .then(server => server ? server.id : null)
       .then(serverId => {
         console.log(`Assigning randomly picked server ${serverId}`);
         return serverId;
       });
}

function getServerIdFromExecution(executionId) {
  return app.database()
            .ref(`executions/${executionId}/common`)
            .once('value')
            .then(snapshot => snapshot.val())
            .then(val => val ? val.server_id : null)
            .then(serverId => {
              console.log(`Found server ${serverId} for execution ${executionId}`);
              return serverId;
            });
}

function getInvocationById(invocationId) {
  return app.database()
       .ref(`invocations/${invocationId}`)
       .once('value')
       .then(snapshot => snapshot.val());
}

function updateInvocation(invocation) {
  return app.database()
       .ref(`invocations/${invocation.common.id}`)
       .set(invocation);
}

const invocationWriter = InvocationWriter(getInvocationById,
                                              getServerIdForHardwareType,
                                              getServerIdFromExecution,
                                              updateInvocation);

export const assignServer = functions.database.ref('/invocations/{id}/common/id')
  .onWrite(event => {
    const invocationId = event.data.val();
    console.log(`Processing invocation: ${invocationId}`);
    return invocationWriter(invocationId);
  });
