import { Observable } from 'rxjs/Observable';

export class ObservableDbRef {

  ref: any;

  constructor (ref: any) {
    this.ref = ref;
  }

  once(eventType: string) {
    return Observable.fromPromise(this.ref.once(eventType))
  }

  onceValue() {
    return this.once('value');
  }

  set(data: any) {
    return Observable.fromPromise(this.ref.set(data));
  }

  childAdded() {
    return Observable.fromEventPattern(handler => this.ref.on('child_added', handler),
                                       handler => this.ref.off('child_added', handler));
  }
}