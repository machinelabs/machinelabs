import { Observable } from 'rxjs/Observable';
import { Invocation } from '@machinelabs/models';

export interface Resolver {
  resolve(invocation: Invocation): Observable<any>;
}
