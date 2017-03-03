import { Observable } from '@reactivex/rxjs';
import { Lab } from '../models/lab';

export interface ProcessStreamData {
  origin: string,
  raw: any,
  str: string
}

export interface CodeRunner {
  run (lab: Lab) : Observable<ProcessStreamData>
  stop (lab: Lab) : void
}