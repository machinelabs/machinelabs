import { Observable } from '@reactivex/rxjs';
import { ValidationRule } from './rule';
import { ExtendedUser } from '../../models/user';
import { Invocation } from '../../models/invocation';
import { ValidationResult } from '../validation-result';
import { ExecutionRejectionReason, ExecutionRejectionInfo } from '../../models/execution';
import { UserResolver } from '../resolver/user-resolver';

export class NoAnonymousRule implements ValidationRule {

  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    if (!resolves.has(UserResolver)) {
      throw new Error('Missing resoler: UserResolver');
    }

    return resolves
      .get(UserResolver)
      .map(user => (!user || user.common.isAnonymous) ?
        new ExecutionRejectionInfo(ExecutionRejectionReason.NoAnonymous, 'Anonymous users can not start executions') :
        true
      );
  }
}
