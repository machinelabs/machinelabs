import { ObservableDbRef } from './observable-db-ref';
import { ShortMonth } from '@machinelabs/models';

export class DbRefBuilder {
  constructor(private db: any) {}

  rootRef() {
    return new ObservableDbRef(this.db.ref());
  }

  mountRef(userId: string, mount: string) {
    return new ObservableDbRef(this.db.ref(`mounts/${userId}/${mount}`));
  }

  userRef(id: string) {
    return new ObservableDbRef(this.db.ref(`users/${id}`));
  }

  labRef(id: string) {
    return new ObservableDbRef(this.db.ref(`labs/${id}/common`));
  }

  labsForHashRef(hash: string) {
    return new ObservableDbRef(this.db.ref(`labs`).orderByChild('common/cache_hash').equalTo(hash));
  }

  serverRef(id: string) {
    return new ObservableDbRef(this.db.ref(`servers/${id}`));
  }

  dockerImagesRef() {
    return new ObservableDbRef(this.db.ref(`docker_images/`));
  }

  invocationRef(id: string) {
    return new ObservableDbRef(this.db.ref(`invocations/${id}/common`));
  }

  invocationsForServerRef(server: string) {
    return new ObservableDbRef(this.db.ref('invocations').orderByChild(`server/id`).equalTo(server));
  }

  newInvocationsRef() {
    return new ObservableDbRef(this.db.ref('invocations').orderByChild('common/timestamp').startAt(Date.now()));
  }

  newInvocationsForServerRef(server: string) {
    return new ObservableDbRef(this.db.ref('invocations').orderByChild(`server/${server}/timestamp`).startAt(Date.now()));
  }

  executionRef(id: string) {
    return new ObservableDbRef(this.db.ref(`executions/${id}/common`));
  }

  executionMessagesRef(id: string) {
    return new ObservableDbRef(this.db.ref(`executions/${id}/messages`));
  }

  userExecutionsByMonthRef(userId: string, year: number, month: ShortMonth) {
    return new ObservableDbRef(this.db.ref(`idx/user_executions/${userId}/${year}/${month}`));
  }

  userExecutionsLiveRef(userId: string) {
    return new ObservableDbRef(this.db.ref(`idx/user_executions/${userId}/live`));
  }

  executionByHashRef(hash: string) {
    return new ObservableDbRef(this.db.ref(`executions`)
                                 .orderByChild('common/cache_hash')
                                 .equalTo(hash));
  }

  executionMessageRef(executionId: string, messageId: string) {
    return new ObservableDbRef(this.db.ref(`executions/${executionId}/messages/${messageId}`));
  }
}

