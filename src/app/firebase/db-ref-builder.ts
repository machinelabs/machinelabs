import { Injectable, Inject } from '@angular/core';
import { environment } from 'environments/environment';
import { DATABASE } from 'app/app.tokens';
import { ObservableDbRef } from './observable-db-ref';

@Injectable()
export class DbRefBuilder {
  constructor(@Inject(DATABASE) private db) {}

  userRef(id: string) {
    return new ObservableDbRef(this.db.ref(`users/${id}/common`));
  }

  labRef(id: string) {
    return new ObservableDbRef(this.db.ref(`labs/${id}/common`));
  }

  invocationRef(id: string) {
    return new ObservableDbRef(this.db.ref(`invocations/${id}/common`));
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

  userLabsRef(id: string) {
    return new ObservableDbRef(this.db.ref(`labs`).orderByChild('common/user_id').equalTo(id));
  }
}

