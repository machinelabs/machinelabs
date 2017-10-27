import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

export const snapshotToValue = (source: Observable<firebase.database.DataSnapshot>) =>
  source.map(snapshot => snapshot.val());
