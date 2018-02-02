import { SpawnOptions, spawn as _spawn } from 'child_process';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { toObservableProcess } from './observable-process';
import { OutputType, ProcessStreamData } from './process-stream-data';

export type SpawnFn = (command: string, args?: Array<string>, options?: SpawnOptions) => Observable<ProcessStreamData>;
export type SpawnShellFn = (command: string, args?: Array<string>) => Observable<ProcessStreamData>;

export const spawn = (command: string, args?: Array<string>, options?: SpawnOptions) => {
  return defer(() => {
    let ps = _spawn(command, args, options);

    return toObservableProcess(ps);
  });
};

export const spawnShell = (command: string, args?: Array<string>) => {
  return spawn(command, args || [], { shell: true });
};
