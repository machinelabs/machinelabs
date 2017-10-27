import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

export const snapshotToValue = (source: Observable<firebase.database.DataSnapshot>) =>
  source.pipe(map(snapshot => snapshot.val()));
