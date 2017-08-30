import { Observable } from '@reactivex/rxjs';

export enum OutputType {
  Stdout = 'stdout',
  Stderr = 'stderr'
}

export interface ProcessStreamData {
  origin: OutputType;
  raw: any;
  str: string;
}

export const toProcessStreamData = (type: OutputType, str: string) => (<ProcessStreamData>{
  origin: type,
  str: str
});

export const stdoutMsg = (text: string) => toProcessStreamData(OutputType.Stdout, text);
export const stderrMsg = (text: string) => toProcessStreamData(OutputType.Stderr, text);
export const stdout = (text: string) => Observable.of(stdoutMsg(text));
export const stderr = (text: string) => Observable.of(stderrMsg(text));