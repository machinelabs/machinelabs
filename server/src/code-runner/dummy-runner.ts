import { Observable } from '@reactivex/rxjs';
import { CodeRunner } from './code-runner';
import { Invocation } from '../models/invocation';
import { PrivateLabConfiguration } from '../models/lab-configuration';
import { spawn, ProcessStreamData } from '@machinelabs/core';

/**
 * This is a DummyRunner that ignores the code and just invokes a ping on machinelabs.ai
 */
export class DummyRunner implements CodeRunner {
  run(invocation: Invocation, configuration: PrivateLabConfiguration): Observable<ProcessStreamData> {
    return spawn(`ping`, ['-c10', 'machinelabs.ai']);
  }

  stop(id: string) {

  }

  count() {
    return 0;
  }
}
