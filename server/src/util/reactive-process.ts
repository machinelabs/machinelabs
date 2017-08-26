import { SpawnOptions, spawn as _spawn } from 'child_process';
import { Observable } from '@reactivex/rxjs';

import { ProcessUtil } from '../util/process';


export const spawn = (command: string, args?: Array<string>, options?: SpawnOptions) => {
  return Observable.defer(() => {
    let ps = _spawn(command, args, options);

    return ProcessUtil.toObservableProcess(ps);
  });
};

export const spawnShell = (command: string, args?: Array<string>) => {
  return spawn(command, args || [], { shell: true });
};
