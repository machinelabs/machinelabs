import { Observable } from '@reactivex/rxjs';
import { Invocation } from '../models/invocation';

export interface ProcessStreamData {
  origin: string,
  raw: any,
  str: string
}

export interface CodeRunner {
  run (invocation: Invocation) : Observable<ProcessStreamData>
  stop (invocation: Invocation) : void
}