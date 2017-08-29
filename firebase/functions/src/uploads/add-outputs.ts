import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { TriggerAnnotated, Event } from 'firebase-functions';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';
import { UploadType } from './upload-type';

export const bucketChange = functions.storage.object().onChange(event => {

  if (!event.data || !event.data.metadata || event.data.metadata['type'] !== UploadType.ExecutionOutput) {
    return Promise.resolve(true);
  }

  let { execution_id, user_id, name } = event.data.metadata;

  let id = admin.database().ref().push().key;

  let output = {
    id, execution_id, user_id, name,
    path: event.data.name,
    content_type: event.data.contentType,
    created_at: Date.now(),
    size_bytes: event.data.size
  };

  return admin.database().ref(`/executions/${execution_id}/outputs/${id}`).update(output);
});
