import { Observable } from '@reactivex/rxjs';
import { Invocation } from '../models/invocation';
import { InternalLabConfiguration } from '../models/lab-configuration';
import { ProcessStreamData } from '@machinelabs/core';

export interface CodeRunner {
  run (invocation: Invocation, configuration: InternalLabConfiguration): Observable<ProcessStreamData>;
  stop (id: string): void;
  count(): number;
}
