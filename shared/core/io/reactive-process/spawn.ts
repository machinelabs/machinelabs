import { SpawnOptions, spawn as _spawn } from 'child_process';
import { Observable } from '@reactivex/rxjs';
import { toObservableProcess } from './observable-process';
import { OutputType } from './process-stream-data';

export const spawn = (command: string, args?: Array<string>, options?: SpawnOptions) => {
  return Observable.defer(() => {
    let ps = _spawn(command, args, options);

    return toObservableProcess(ps);
  });
};

export const spawnShell = (command: string, args?: Array<string>) => {
  return spawn(command, args || [], { shell: true });
};
