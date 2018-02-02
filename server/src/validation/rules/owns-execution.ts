import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ValidationRule } from './rule';
import { Invocation, SYSTEM_USER } from '@machinelabs/models';
import { ValidationResult } from '../validation-result';
import { Execution } from '@machinelabs/models';
import { ExecutionResolver } from '../resolver/execution-resolver';


const isOwnerOrSystem = (exUserId: string, invUserId: string) => exUserId === invUserId || invUserId === SYSTEM_USER;

export class OwnsExecutionRule implements ValidationRule {

  check(invocation: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    if (!resolves.has(ExecutionResolver)) {
      throw new Error('Missing resoler: ExecutionResolver');
    }

    return resolves
      .get(ExecutionResolver)
      .pipe(
        map((execution: Execution) => isOwnerOrSystem(execution.user_id, invocation.user_id))
      );
  }
}
