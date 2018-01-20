import { Lab } from '@machinelabs/models';
import { Observable } from '@reactivex/rxjs';
import * as firebase from 'firebase';

import { DbRefBuilder } from '../firebase/db-ref-builder';
import { stringifyDirectory } from '../io/lab-fs/serialize';

export class LabApi {
  constructor(private refBuilder: DbRefBuilder) {

  }

  save(lab: Lab) {
    return this.refBuilder.labRef(lab.id).set({
      id: lab.id,
      user_id: lab.user_id,
      name: lab.name,
      description: lab.description,
      // `lab.tags` can be undefined when editing an existing lab that
      // doesn't have any tags yet.
      tags: lab.tags || [],
      directory: stringifyDirectory(lab.directory),
      // We typecast `hidden` to boolean to ensure exsting labs that haven't
      // migrated yet (and therefore don't have a `hidden` property) don't
      // make this code break.
      hidden: !!lab.hidden,
      created_at: lab.created_at,
      modified_at: firebase.database.ServerValue.TIMESTAMP,
      fork_of: lab.fork_of || null,
      is_private: !!lab.is_private
    });
  }

}
