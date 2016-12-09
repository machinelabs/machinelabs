import { Observable } from '@ReactiveX/rxjs';

export interface ProcessStreamData {
  origin: string,
  raw: any,
  str: string
}

export interface CodeRunner {
  run (code: string) : Observable<ProcessStreamData>
}