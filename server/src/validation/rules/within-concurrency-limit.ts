import { Observable } from '@reactivex/rxjs';
import { ValidationRule } from './rule';
import { Invocation, ExecutionRejectionInfo, ExecutionRejectionReason } from '@machinelabs/models';
import { ValidationResult } from '../validation-result';
import { dbRefBuilder } from '../../ml-firebase';

export class WithinConcurrencyLimit implements ValidationRule {

  constructor(private maxConcurrentExecutions = 2) {}

  check(invocation: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {


    return dbRefBuilder
            .userExecutionsLiveRef(invocation.user_id)
            .onceValue()
            .map(snapshot => snapshot.val())
            .map(entries => Object.keys(entries || {}).length >= this.maxConcurrentExecutions ?
              new ExecutionRejectionInfo(ExecutionRejectionReason.ExceedsMaximumConcurrency, 'User has too many parallel executions') :
              true);
  }
}
