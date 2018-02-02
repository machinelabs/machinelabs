import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ValidationRule } from './rule';
import { Invocation, ExecutionRejectionInfo, ExecutionRejectionReason } from '@machinelabs/models';
import { ValidationResult } from '../validation-result';
import { CodeRunner } from '../../code-runner/code-runner';

export class ServerHasCapacityRule implements ValidationRule {

  constructor(private codeRunner: CodeRunner, private maxServerExecutions = 100) {
  }

  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    return this.codeRunner.count() > this.maxServerExecutions ?
      of(new ExecutionRejectionInfo(ExecutionRejectionReason.OverCapacity, 'Server is over capacity')) :
      of(true);
  }
}
