import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

import 'rxjs/add/observable/fromEventPattern';
import 'rxjs/add/observable/fromPromise';

export class ObservableDbRef {

  ref: firebase.database.Reference;

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

  equalTo(value: any) {
    return new ObservableDbRef(this.ref.equalTo(value));
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

  child(path: string) {
    return new ObservableDbRef(this.ref.child(path));
  }

  childAdded(): Observable<firebase.database.DataSnapshot> {
    return this.on('child_added');
  }

  value(): Observable<firebase.database.DataSnapshot> {
    return this.on('value');
  }

  on(eventName: string): Observable<firebase.database.DataSnapshot> {
    return Observable.fromEventPattern((handler: any) => this.ref.on(eventName, handler),
                                       (handler: any) => this.ref.off(eventName, handler));
  }
}

