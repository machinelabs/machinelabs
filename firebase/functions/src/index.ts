import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { TriggerAnnotated, Event} from 'firebase-functions';
import { DeltaSnapshot } from 'firebase-functions/lib/providers/database';


export { assignServer } from './assign-server';
export { postLabWrite } from './post-lab-write';
export { postExecutionWrite } from './post-execution-write';

admin.initializeApp(functions.config().firebase);
