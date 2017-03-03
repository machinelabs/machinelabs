import { spawn } from 'child_process';
import { ProcessUtil } from '../util/process';
import { Observable } from '@reactivex/rxjs';
import { CodeRunner, ProcessStreamData } from './code-runner';
import { Lab } from '../models/lab';

/**
 * This is a DummyRunner that ignores the code and just invokes a ping on machinelabs.ai
 */
export class DummyRunner implements CodeRunner {
  run(lab: Lab): Observable<ProcessStreamData> {
    return ProcessUtil.toObservableProcess(spawn(`ping`, ['-c10', 'machinelabs.ai']))
  }

  stop(lab: Lab) {
    
  }
}
