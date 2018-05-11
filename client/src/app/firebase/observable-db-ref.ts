import * as firebase from 'firebase';

import { Observable, fromEventPattern, from as fromPromise } from 'rxjs';

export class ObservableDbRef {
  ref: any;

  constructor(ref: any) {
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

  equalTo(value: any) {
    return new ObservableDbRef(this.ref.equalTo(value));
  }

  once(eventType: string): Observable<firebase.database.DataSnapshot> {
    return fromPromise(this.ref.once(eventType));
  }

  onceValue(): Observable<firebase.database.DataSnapshot> {
    return this.once('value');
  }

  set(data: any): Observable<firebase.database.DataSnapshot> {
    return fromPromise(this.ref.set(data));
  }

  update(data: any): Observable<firebase.database.DataSnapshot> {
    return fromPromise(this.ref.update(data));
  }

  childAdded(): Observable<firebase.database.DataSnapshot> {
    return this.on('child_added');
  }

  value(): Observable<firebase.database.DataSnapshot> {
    return this.on('value');
  }

  on(eventName: string): Observable<firebase.database.DataSnapshot> {
    return fromEventPattern(
      handler => this.ref.on(eventName, val => handler(val)),
      handler => this.ref.off(eventName, handler)
    );
  }
}
