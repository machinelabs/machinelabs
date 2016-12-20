import { Observable } from '@ReactiveX/rxjs';
import { Lab } from '../models/lab';

export interface ProcessStreamData {
  origin: string,
  raw: any,
  str: string
}

export interface CodeRunner {
  run (lab: Lab) : Observable<ProcessStreamData>
}