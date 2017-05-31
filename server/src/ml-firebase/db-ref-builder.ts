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
    return new ObservableDbRef(db.ref(`labs/${id}/common`));
  }

  labsForHashRef(hash: string) {
    return new ObservableDbRef(db.ref(`labs`).orderByChild('common/cache_hash').equalTo(hash));
  }

  serverRef(id: string) {
    return new ObservableDbRef(db.ref(`servers/${id}`));
  }

  invocationRef(id: string) {
    return new ObservableDbRef(db.ref(`invocations/${id}/common`));
  }

  invocationsForServerRef(server:string) {
    return new ObservableDbRef(db.ref('invocations').orderByChild(`server/id`).equalTo(server));
  }

  newInvocationsRef() {
    return new ObservableDbRef(db.ref('invocations').orderByChild('common/timestamp').startAt(Date.now()));
  }

  newInvocationsForServerRef(server: string) {
    return new ObservableDbRef(db.ref('invocations').orderByChild(`server/${server}/timestamp`).startAt(Date.now()));
  }

  executionRef(id: string) {
    return new ObservableDbRef(db.ref(`executions/${id}/common`));
  }

  executionByHashRef(hash: string) {
    return new ObservableDbRef(db.ref(`executions`)
                                 .orderByChild('common/cache_hash')
                                 .equalTo(hash));
  }

  executionMessagesRef(id: string) {
    return new ObservableDbRef(db.ref(`executions/${id}/messages`));
  }

  executionMessageRef(executionId: string, messageId: string) {
    return new ObservableDbRef(db.ref(`executions/${executionId}/messages/${messageId}`));
  }
}

