// FIXME: Workaround to get the type until typescript typing import is fixed
export type Observable<T> = any;

export interface ProcessStreamData {
  origin: string,
  raw: any,
  str: string
}

export interface CodeRunner {
  run (code: string) : Observable<ProcessStreamData>
}