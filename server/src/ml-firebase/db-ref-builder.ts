import { environment } from '../environments/environment';
import { db } from '../ml-firebase';
import { ObservableDbRef } from 'machinelabs-core';
import { ShortMonth } from '../models/months';

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

  dockerImagesRef() {
    return new ObservableDbRef(db.ref(`docker_images/`));
  }

  invocationRef(id: string) {
    return new ObservableDbRef(db.ref(`invocations/${id}/common`));
  }

  invocationsForServerRef(server: string) {
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

  userExecutionsByMonthRef(userId: string, year: number, month: ShortMonth) {
    return new ObservableDbRef(db.ref(`idx/user_executions/${userId}/${year}/${month}`));
  }

  userExecutionsLiveRef(userId: string) {
    return new ObservableDbRef(db.ref(`idx/user_executions/${userId}/live`));
  }

  executionByHashRef(hash: string) {
    return new ObservableDbRef(db.ref(`executions`)
                                 .orderByChild('common/cache_hash')
                                 .equalTo(hash));
  }

  executionMessagesRef(id: string, limitToFirst = 0) {
    if (limitToFirst > 0) {
      return new ObservableDbRef(db.ref(`executions/${id}/messages`).limitToFirst(limitToFirst));
    } else {
      return new ObservableDbRef(db.ref(`executions/${id}/messages`));
    }
  }

  executionMessageRef(executionId: string, messageId: string) {
    return new ObservableDbRef(db.ref(`executions/${executionId}/messages/${messageId}`));
  }
}

