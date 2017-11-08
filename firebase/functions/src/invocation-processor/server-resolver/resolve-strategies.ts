import * as toArray from 'lodash.toarray';
import * as sample from 'lodash.sample';
import { database } from '../database';
import { Invocation } from '../../models/invocation';

const DEFAULT_HARDWARE_TYPE = 'economy';

export function getServerIdForHardwareType(invocation: Invocation) {

  return database
       .ref('servers')
       .orderByChild('hardware_type')
       .equalTo(DEFAULT_HARDWARE_TYPE)
       .once('value')
       .then(snapshot => snapshot.val())
       // pick a random server
       .then(val => sample(toArray(val).filter(server => !server.disabled)))
       .then(server => server ? server.id : null)
       .then(serverId => {
         console.log(`Assigning randomly picked server ${serverId}`);
         return serverId;
       });
}

export function getServerIdFromExecution(invocation: Invocation) {
  return database
            .ref(`executions/${invocation.data.execution_id}/common`)
            .once('value')
            .then(snapshot => snapshot.val())
            .then(val => val ? val.server_id : null)
            .then(serverId => {
              console.log(`Found server ${serverId} for execution ${invocation.data.execution_id}`);
              return serverId;
            });
}
