import { Observable } from '@reactivex/rxjs';
import { Invocation } from '../models/invocation';
import { PrivateLabConfiguration } from '../models/lab-configuration';
import { ProcessStreamData } from '@machinelabs/core';

export interface CodeRunner {
  run (invocation: Invocation, configuration: PrivateLabConfiguration): Observable<ProcessStreamData>;
  stop (id: string): void;
  count(): number;
}
