import { environment } from '../environments/environment';
import { db, ObservableDbRef } from '../ml-firebase';

export class DbRefBuilder {
  constructor() {}

  rootRef() {
    return new ObservableDbRef(db.ref());
  }

  userRef(id: string) {
    return new ObservableDbRef(db.ref(`users/${id}`));
  }

  labRef(id: string) {
    return new ObservableDbRef(db.ref(`labs/${id}`));
  }

  labsForHashRef(hash: string) {
    return new ObservableDbRef(db.ref(`labs`).orderByChild('file_set_hash').equalTo(hash));
  }

  invocationRef(id: string) {
    return new ObservableDbRef(db.ref(`invocations/${id}`));
  }

  invocationsRef() {
    return new ObservableDbRef(db.ref(`invocations`));
  }

  newInvocationsRef() {
    return new ObservableDbRef(db.ref('invocations').orderByChild('timestamp').startAt(Date.now()));
  }

  executionRef(id: string) {
    return new ObservableDbRef(db.ref(`executions/${id}`));
  }

  executionByHashRef(hash: string) {
    return new ObservableDbRef(db.ref(`executions`)
                                 .orderByChild('file_set_hash')
                                 .equalTo(hash));
  }

  executionMessagesRef(id: string) {
    return new ObservableDbRef(db.ref(`executions_messages/${id}`));
  }

  executionMessageRef(executionId: string, messageId: string) {
    return new ObservableDbRef(db.ref(`executions_messages/${executionId}/${messageId}`));
  }
}

