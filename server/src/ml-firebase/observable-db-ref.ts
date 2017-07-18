import { Observable } from '@reactivex/rxjs';
import * as firebase from 'firebase';

export class ObservableDbRef {

  ref: any;

  constructor (ref: any) {
    this.ref = ref;
  }

  limitToLast(limit: number) {
    return new ObservableDbRef(this.ref.limitToLast(limit));
  }

  limitToFirst(limit: number) {
    return new ObservableDbRef(this.ref.limitToFirst(limit));
  }

  orderByChild(value: any) {
    return new ObservableDbRef(this.ref.orderByChild(value));
  }

  startAt(value: any, key?: any) {
    return new ObservableDbRef(this.ref.startAt(value, key));
  }

  endAt(value: any, key?: any) {
    return new ObservableDbRef(this.ref.endAt(value, key));
  }

  once(eventType: string): Observable<firebase.database.DataSnapshot> {
    return Observable.fromPromise(this.ref.once(eventType));
  }

  onceValue(): Observable<firebase.database.DataSnapshot> {
    return this.once('value');
  }

  set(data: any): Observable<firebase.database.DataSnapshot> {
    return Observable.fromPromise(this.ref.set(data));
  }

  update(data: any): Observable<firebase.database.DataSnapshot> {
    return Observable.fromPromise(this.ref.update(data));
  }

  childAdded(): Observable<firebase.database.DataSnapshot> {
    return Observable.fromEventPattern(handler => this.ref.on('child_added', handler),
                                       handler => this.ref.off('child_added', handler));
  }

  childChanged(): Observable<firebase.database.DataSnapshot> {
    return Observable.fromEventPattern(handler => this.ref.on('child_changed', handler),
                                       handler => this.ref.off('child_changed', handler));
  }
}

