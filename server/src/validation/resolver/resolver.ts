import { Observable } from '@reactivex/rxjs';
import { Invocation } from '@machinelabs/models';

export interface Resolver {
  resolve(invocation: Invocation): Observable<any>;
}
