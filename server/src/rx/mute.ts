import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export const mute = <T>(obs: Observable<T>) => obs.pipe(filter(() => false));
