import { Observable } from '@reactivex/rxjs';
import { Invocation } from '../../models/invocation';

export interface Resolver {
  resolve(invocation: Invocation): Observable<any>;
}
