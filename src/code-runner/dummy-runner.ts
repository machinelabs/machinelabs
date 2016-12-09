import { spawn } from 'child_process';
import { ProcessUtil } from '../util/process';
import { Observable } from '@ReactiveX/rxjs';
import { CodeRunner, ProcessStreamData } from './code-runner';

/**
 * This is a DummyRunner that ignores the code and just invokes a ping on machinelabs.ai
 */
export class DummyRunner {
  run(code): Observable<ProcessStreamData> {
    return ProcessUtil.toObservableProcess(spawn(`ping`, ['-c10', 'machinelabs.ai']))
  }
}
