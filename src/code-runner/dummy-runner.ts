import { spawn } from 'child_process';
import { ProcessUtil } from '../util/process';
import { CodeRunner, ProcessStreamData } from './code-runner';

// FIXME: Workaround to get the type until typescript typing import is fixed
export type Observable<T> = any;

/**
 * This is a DummyRunner that ignores the code and just invokes a ping on machinelabs.ai
 */
export class DummyRunner {
  run(code): Observable<ProcessStreamData> {
    return ProcessUtil.toObservableProcess(spawn(`ping`, ['-c10', 'machinelabs.ai']))
  }
}
