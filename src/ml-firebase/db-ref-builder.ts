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

  runRef(id: string) {
    return new ObservableDbRef(db.ref(`runs/${id}`));
  }

  runsRef() {
    return new ObservableDbRef(db.ref(`runs`));
  }

  newRunsRef() {
    return new ObservableDbRef(db.ref('runs').orderByChild('timestamp').startAt(Date.now()));
  }

  runMetaRef(id: string) {
    return new ObservableDbRef(db.ref(`runs_meta/${id}`));
  }

  runMetaByHashRef(hash: string) {
    return new ObservableDbRef(db.ref(`runs_meta`)
                                 .orderByChild('file_set_hash')
                                 .equalTo(hash));
  }

  processMessagesRef(id: string) {
    return new ObservableDbRef(db.ref(`process_messages/${id}`));
  }

  processMessageRef(processId: string, messageId: string) {
    return new ObservableDbRef(db.ref(`process_messages/${processId}/${messageId}`));
  }
}

