import { Observable } from '@reactivex/rxjs';
import { ValidationRule } from './rule';
import { ExtendedUser } from '../../models/user';
import { Invocation } from '../../models/invocation';
import { ValidationResult } from '../validation-result';
import { ExecutionRejectionInfo, ExecutionRejectionReason } from '../../models/execution';
import { UserResolver } from '../resolver/user-resolver';

const PLANS = ['admin', 'beta'];

export class HasPlanRule implements ValidationRule {

  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    if (!resolves.has(UserResolver)) {
      throw new Error('Missing resoler: UserResolver');
    }

    return resolves
      .get(UserResolver)
      .map(user => (user && user.plan && PLANS.includes(user.plan.plan_id)) ||
        new ExecutionRejectionInfo(ExecutionRejectionReason.NoPlan, 'Missing plan that allows executions'));
  }
}
