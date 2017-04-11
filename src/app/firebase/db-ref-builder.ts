import { Injectable, Inject } from '@angular/core';
import { environment } from 'environments/environment';
import { DATABASE } from 'app/app.tokens';
import { ObservableDbRef } from './observable-db-ref';

@Injectable()
export class DbRefBuilder {
  constructor(@Inject(DATABASE) private db) {}

  userRef(id: string) {
    return new ObservableDbRef(this.db.ref(`users/${id}`));
  }

  labRef(id: string) {
    return new ObservableDbRef(this.db.ref(`labs/${id}`));
  }

  runRef(id: string) {
    return new ObservableDbRef(this.db.ref(`runs/${id}`));
  }

  processMessageRef(id: string) {
    return new ObservableDbRef(this.db.ref(`process_messages/${id}`));
  }
}

