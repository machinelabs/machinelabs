import { Observable } from '@reactivex/rxjs';
import { ValidationRule } from './rule';
import { Invocation, SpecialUser } from '@machinelabs/models';
import { ValidationResult } from '../validation-result';
import { Execution } from '@machinelabs/models';
import { ExecutionResolver } from '../resolver/execution-resolver';


const isOwnerOrSystem = (exUserId: string, invUserId: string) => exUserId === invUserId || invUserId === SpecialUser.System;

export class OwnsExecutionRule implements ValidationRule {

  check(invocation: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    if (!resolves.has(ExecutionResolver)) {
      throw new Error('Missing resoler: ExecutionResolver');
    }

    return resolves
      .get(ExecutionResolver)
      .map((execution: Execution) => isOwnerOrSystem(execution.user_id, invocation.user_id));
  }
}
