import { Observable } from 'rxjs';
import { Invocation } from '@machinelabs/models';
import { InternalLabConfiguration } from '../models/lab-configuration';
import { ProcessStreamData } from '@machinelabs/core';

export interface CodeRunner {
  run(invocation: Invocation, configuration: InternalLabConfiguration): Observable<ProcessStreamData>;
  stop(id: string): void;
  count(): number;
}
