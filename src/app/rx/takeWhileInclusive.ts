import { Observable } from 'rxjs/Observable';

function takeWhileInclusive(predicate) {
  return this.publish(co => co.takeWhile(predicate)
                              .merge(co.skipWhile(predicate).take(1)));

}

Observable.prototype.takeWhileInclusive = takeWhileInclusive;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    takeWhileInclusive: typeof takeWhileInclusive;
  }
}

