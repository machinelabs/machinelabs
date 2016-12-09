import { spawn } from 'child_process';
import * as fs from 'fs';
import { ProcessUtil } from '../util/process';
import { CodeRunner, ProcessStreamData } from './code-runner';

// FIXME: Workaround to get the type until typescript typing import is fixed
export type Observable<T> = any;

/**
 * This is the Docker Runner that takes the code and runs it on a isolated docker container
 */
export class DockerRunner implements CodeRunner {
  run(code): Observable<ProcessStreamData> {

    // FixMe: Sync is bad. Kitten die. But this code has even more issues so keep calm. 
    fs.writeFileSync(`${process.cwd()}/labfs/run.py`, code);
    return ProcessUtil
            .toObservableProcess(spawn(`docker`, [
                                                  'run',
                                                  '-i',
                                                  '--rm',
                                                  '-v',
                                                  `${process.cwd()}/labfs:/labfs`,
                                                  'thoughtram/keras',
                                                  'python',
                                                  '/labfs/run.py'
                                                  ]))
  }
}
