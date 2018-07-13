import { Observable } from 'rxjs';
import { Invocation } from '@machinelabs/models';

export interface Resolver {
  resolve(invocation: Invocation): Observable<any>;
}
