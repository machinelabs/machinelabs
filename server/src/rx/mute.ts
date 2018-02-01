import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';

export const mute = <T>(obs: Observable<T>) => obs.pipe(filter(() => false));
