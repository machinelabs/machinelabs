import { database } from './database';

export const getInvocationById = invocationId =>
  database
  .ref(`invocations/${invocationId}`)
  .once('value')
  .then(snapshot => snapshot.val());

export const updateInvocation = invocationWrapper =>
  database
  .ref(`invocations/${invocationWrapper.common.id}`)
  .set(invocationWrapper);
