import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ValidationRule } from './rule';
import { ExtendedUser } from '../../models/user';
import { Invocation, ExecutionRejectionInfo, ExecutionRejectionReason } from '@machinelabs/models';
import { ValidationResult } from '../validation-result';
import { UserResolver } from '../resolver/user-resolver';

export class NoAnonymousRule implements ValidationRule {

  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    if (!resolves.has(UserResolver)) {
      throw new Error('Missing resoler: UserResolver');
    }

    return resolves
      .get(UserResolver)
      .pipe(
        map(user => (!user || user.common.isAnonymous) ?
          new ExecutionRejectionInfo(ExecutionRejectionReason.NoAnonymous, 'Anonymous users can not start executions') :
          true
        )
      );
  }
}
