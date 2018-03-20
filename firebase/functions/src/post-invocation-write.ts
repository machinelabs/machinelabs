import * as functions from 'firebase-functions';
import { TriggerAnnotated, Event } from 'firebase-functions';
import { DeltaSnapshot } from 'firebase-functions/lib/providers/database';

import { InvocationProcessor } from './invocation-processor/invocation-processor';
import { getInvocationById, updateInvocation } from './invocation-processor/invocation-crud';

import {
  getServerIdForHardwareType,
  getServerIdFromExecution
} from './invocation-processor/server-resolver/resolve-strategies';

import { ServerResolver } from './invocation-processor/server-resolver/server-resolver';

const serverResolver = new ServerResolver(getServerIdForHardwareType, getServerIdFromExecution);

const invocationProcessor = new InvocationProcessor(getInvocationById, serverResolver, updateInvocation);

export const postInvocationWrite = functions.database
  .ref('/invocations/{id}/common/id')
  .onWrite(event => invocationProcessor.process(event.data.val()));
