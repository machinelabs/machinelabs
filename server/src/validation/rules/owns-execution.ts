import { Observable } from '@reactivex/rxjs'
import { ValidationRule } from './rule';
import { Invocation } from '../../models/invocation';
import { ValidationResult } from '../validation-result';
import { Execution } from '@machinelabs/core';
import { ExecutionResolver } from '../resolver/execution-resolver';

export class OwnsExecutionRule implements ValidationRule {

  check(invocation: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    if (!resolves.has(ExecutionResolver)) {
      throw new Error('Missing resoler: ExecutionResolver');
    }

    return resolves
      .get(ExecutionResolver)
      .map((execution: Execution) => execution.user_id === invocation.user_id);
  }
}