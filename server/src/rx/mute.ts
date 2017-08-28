import { Observable } from '@reactivex/rxjs';

export const mute = (obs: Observable<any>) => obs.filter(() => false);
