import * as admin from 'firebase-admin';
import { storage } from 'firebase-functions';

import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';
import { Runnable, TriggerAnnotated } from 'firebase-functions/lib/cloud-functions';

import { UploadType } from './upload-type';

export const bucketChange = storage.object().onFinalize((data, context) => {
  if (
    !data ||
    parseInt(data.metageneration, 10) > 1 ||
    !data.metadata ||
    data.metadata['type'] !== UploadType.ExecutionOutput
  ) {
    return Promise.resolve(true);
  }

  const { execution_id, user_id, name } = data.metadata;

  const id = admin
    .database()
    .ref()
    .push().key;

  const output = {
    id,
    execution_id,
    user_id,
    name,
    path: data.name,
    content_type: '',
    created_at: Date.now(),
    size_bytes: data.size
  };

  return admin
    .database()
    .ref(`/executions/${execution_id}/outputs/${id}`)
    .update(output);
});
