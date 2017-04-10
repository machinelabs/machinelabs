import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

export class ObservableDbRef {

  ref: any;

  constructor (ref: any) {
    this.ref = ref;
  }

  once(eventType: string): Observable<firebase.database.DataSnapshot> {
    return Observable.fromPromise(this.ref.once(eventType))
  }

  onceValue(): Observable<firebase.database.DataSnapshot> {
    return this.once('value');
  }

  set(data: any): Observable<firebase.database.DataSnapshot> {
    return Observable.fromPromise(this.ref.set(data));
  }

  childAdded(): Observable<firebase.database.DataSnapshot> {
    return Observable.fromEventPattern(handler => this.ref.on('child_added', handler),
                                       handler => this.ref.off('child_added', handler));
  }
}