import { environment } from '../environments/environment';
import { db, ObservableDbRef } from '../ml-firebase';

export class DbRefBuilder {
  constructor() {}

  userRef(id: string) {
    return new ObservableDbRef(db.ref(`users/${id}`));
  }

  labRef(id: string) {
    return new ObservableDbRef(db.ref(`labs/${id}`));
  }

  runRef(id: string) {
    return new ObservableDbRef(db.ref(`runs/${id}`));
  }

  processMessageRef(id: string) {
    return new ObservableDbRef(db.ref(`process_messages/${id}`));
  }
}

