import { Observable } from '@reactivex/rxjs';
import { Run } from '../models/run';

export interface ProcessStreamData {
  origin: string,
  raw: any,
  str: string
}

export interface CodeRunner {
  run (run: Run) : Observable<ProcessStreamData>
  stop (run: Run) : void
}