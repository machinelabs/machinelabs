import { database } from 'firebase-functions';

import { Change, Runnable, TriggerAnnotated } from 'firebase-functions/lib/cloud-functions';
import { DataSnapshot } from 'firebase-functions/lib/providers/database';

import { InvocationProcessor } from './invocation-processor/invocation-processor';
import { getInvocationById, updateInvocation } from './invocation-processor/invocation-crud';

import {
  getServerIdForHardwareType,
  getServerIdFromExecution
} from './invocation-processor/server-resolver/resolve-strategies';

import { ServerResolver } from './invocation-processor/server-resolver/server-resolver';

const serverResolver = new ServerResolver(getServerIdForHardwareType, getServerIdFromExecution);

const invocationProcessor = new InvocationProcessor(getInvocationById, serverResolver, updateInvocation);

export const postInvocationWrite = database
  .ref('/invocations/{id}/common')
  .onCreate((snapshot, context) => invocationProcessor.process(snapshot.val().id));
