import { spawn } from 'child_process';
import { ProcessUtil } from '../util/process';
import { Observable } from '@reactivex/rxjs';
import { CodeRunner, ProcessStreamData } from './code-runner';
import { Invocation } from '../models/invocation';
import { PrivateLabConfiguration } from 'models/lab-configuration';

/**
 * This is a DummyRunner that ignores the code and just invokes a ping on machinelabs.ai
 */
export class DummyRunner implements CodeRunner {
  run(invocation: Invocation, configuration: PrivateLabConfiguration): Observable<ProcessStreamData> {
    return ProcessUtil.toObservableProcess(spawn(`ping`, ['-c10', 'machinelabs.ai']))
  }

  stop(id: string) {
    
  }

  count() {
    return 0;
  }
}
