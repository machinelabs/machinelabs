import { Observable } from 'rxjs';
import { skipWhile, take, takeWhile, publish, merge } from 'rxjs/operators';

export const takeWhileInclusive = <T>(predicate: (val: T) => boolean) => (source: Observable<T>) => {
  return source.pipe(publish(co => co.pipe(takeWhile(predicate), merge(co.pipe(skipWhile(predicate), take(1))))));
};
