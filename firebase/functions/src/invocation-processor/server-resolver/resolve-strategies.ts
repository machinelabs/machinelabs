import * as toArray from 'lodash.toarray';
import * as sample from 'lodash.sample';
import * as isString from 'lodash.isstring';
import { database } from '../database';
import { Invocation } from '../../models/invocation';
import { readLabConfig } from '../util/lab-config-helper';
import { HardwareType } from '../../models/server';

const DEFAULT_HARDWARE_TYPE = HardwareType.CPU;

export function getServerIdForHardwareType(invocation: Invocation) {
  const config = readLabConfig(invocation);

  const specifiedHardwareType =
    config && isString(config.hardwareType) ? config.hardwareType.toLowerCase() : DEFAULT_HARDWARE_TYPE;

  console.log(`User specified hardware type ${specifiedHardwareType}`);

  const hardwareTypeExists = !!Object.keys(HardwareType)
    .map(key => HardwareType[key])
    .find(val => val === specifiedHardwareType);

  console.log(`User specified hardware does ${hardwareTypeExists ? 'exist' : 'not exist'}`);

  const hardwareType = hardwareTypeExists ? specifiedHardwareType : DEFAULT_HARDWARE_TYPE;

  console.log(`Trying to assign server of hardware type ${hardwareType}`);

  return (
    database
      .ref('servers')
      .orderByChild('hardware_type')
      .equalTo(hardwareType)
      .once('value')
      .then(snapshot => snapshot.val())
      // pick a random server
      .then(val => sample(toArray(val).filter(server => !server.disabled)))
      .then(server => (server ? server.id : null))
      .then(serverId => {
        console.log(`Assigning randomly picked server ${serverId}`);
        return serverId;
      })
  );
}

export function getServerIdFromExecution(invocation: Invocation) {
  return database
    .ref(`executions/${invocation.data.execution_id}/common`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then(val => (val ? val.server_id : null))
    .then(serverId => {
      console.log(`Found server ${serverId} for execution ${invocation.data.execution_id}`);
      return serverId;
    });
}
