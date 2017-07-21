import { Observable } from '@reactivex/rxjs'
import { ValidationRule } from './rule';
import { Invocation } from '../../models/invocation';
import { ValidationResult } from '../validation-result';
import { ExecutionRejectionInfo, ExecutionRejectionReason } from '../../models/execution';
import { UsageStatisticResolver } from '../resolver/usage-statistic-resolver';
import { CodeRunner } from '../../code-runner/code-runner';

export class ServerHasCapacityRule implements ValidationRule {

  constructor(private codeRunner: CodeRunner, private maxServerExecutions = 100) {
  }

  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    return this.codeRunner.count() > this.maxServerExecutions ?
      Observable.of(new ExecutionRejectionInfo(ExecutionRejectionReason.OverCapacity, 'Server is over capacity')) :
      Observable.of(true);
  }
}
