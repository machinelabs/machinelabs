import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';
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

  childChanged(): Observable<firebase.database.DataSnapshot> {
    return this.on('child_changed');
  }

  value(): Observable<firebase.database.DataSnapshot> {
    return this.on('value');
  }

  on(eventName: string): Observable<firebase.database.DataSnapshot> {
    return fromEventPattern(handler => this.ref.on(eventName, handler),
                            handler => this.ref.off(eventName, handler));
  }
}

