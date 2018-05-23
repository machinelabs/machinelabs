import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidationRule } from './rule';
import { ExtendedUser } from '../../models/user';
import { Invocation, ExecutionRejectionInfo, ExecutionRejectionReason, PlanId } from '@machinelabs/models';
import { ValidationResult } from '../validation-result';
import { UserResolver } from '../resolver/user-resolver';

export class HasPlanRule implements ValidationRule {
  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {
    if (!resolves.has(UserResolver)) {
      throw new Error('Missing resoler: UserResolver');
    }

    return resolves
      .get(UserResolver)
      .pipe(
        map(
          user =>
            (user && user.plan && Object.values(PlanId).includes(user.plan.plan_id)) ||
            new ExecutionRejectionInfo(ExecutionRejectionReason.NoPlan, 'Missing plan that allows executions')
        )
      );
  }
}
