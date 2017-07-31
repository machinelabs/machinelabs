import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/merge';

function takeWhileInclusive<T>(predicate: (val: T) => boolean): Observable<T> {
  return this.publish(co => co.takeWhile(predicate)
                              .merge(co.skipWhile(predicate).take(1)));

}

Observable.prototype.takeWhileInclusive = takeWhileInclusive;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    takeWhileInclusive: typeof takeWhileInclusive;
  }
}

