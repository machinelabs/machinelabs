import { Observable } from '@reactivex/rxjs';
import { Invocation } from '../models/invocation';
import { PrivateLabConfiguration } from 'models/lab-configuration';

export interface ProcessStreamData {
  origin: string;
  raw: any;
  str: string;
}

export interface CodeRunner {
  run (invocation: Invocation, configuration: PrivateLabConfiguration): Observable<ProcessStreamData>;
  stop (id: string): void;
  count(): number;
}
