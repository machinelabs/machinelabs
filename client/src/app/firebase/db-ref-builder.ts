import { Injectable, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { DATABASE } from '../app.tokens';
import { ObservableDbRef } from './observable-db-ref';

@Injectable()
export class DbRefBuilder {
  constructor(@Inject(DATABASE) private db) {}

  userRef(id: string) {
    return new ObservableDbRef(this.db.ref(`users/${id}/common`));
  }

  userPlansRef(userId: string) {
    return new ObservableDbRef(this.db.ref(`users/${userId}/plan`));
  }

  labRef(id: string) {
    return new ObservableDbRef(this.db.ref(`labs/${id}/common`));
  }

  invocationRef(id: string) {
    return new ObservableDbRef(this.db.ref(`invocations/${id}/common`));
  }

  labExecutionsRef(id: string) {
    return new ObservableDbRef(this.db.ref(`idx/lab_executions/${id}`));
  }

  labVisibleExecutionsRef(id: string) {
    return new ObservableDbRef(this.db.ref(`idx/lab_visible_executions/${id}`));
  }

  userVisibleExecutionsRef(id: string) {
    return new ObservableDbRef(this.db.ref(`idx/user_visible_executions/${id}`));
  }

  userInvocationRateProofRef(userId: string) {
    return new ObservableDbRef(this.db.ref(`/idx/invocation_rate_proof/${userId}`));
  }

  executionRef(id: string) {
    return new ObservableDbRef(this.db.ref(`executions/${id}/common`));
  }

  executionMessageRef(id: string, limitToLast = 0) {
    if (limitToLast > 0) {
      return new ObservableDbRef(this.db.ref(`executions/${id}/messages`).limitToLast(limitToLast));
    } else {
      return new ObservableDbRef(this.db.ref(`executions/${id}/messages`));
    }
  }

  executionOutputFilesRef(executionId: string) {
    return new ObservableDbRef(this.db.ref(`executions/${executionId}/outputs`));
  }

  recentLabsRef() {
    return new ObservableDbRef(this.db.ref('idx/recent_labs'));
  }

  userLabsRef(id: string) {
    return new ObservableDbRef(this.db.ref(`idx/user_labs/${id}`));
  }

  userVisibleLabsRef(id: string) {
    return new ObservableDbRef(this.db.ref(`idx/user_visible_labs/${id}`));
  }

  rootRef() {
    return new ObservableDbRef(this.db.ref());
  }

  handshakeCommitRef(id: string) {
    return new ObservableDbRef(this.db.ref(`/handshakes/${id}/commit`));
  }

  dockerImagesRef() {
    return new ObservableDbRef(this.db.ref('docker_images/common'));
  }
}
