import { Observable } from '@reactivex/rxjs';
import { ValidationRule } from './rule';
import { Invocation } from '../../models/invocation';
import { ValidationResult } from '../validation-result';
import { UserResolver } from '../resolver/user-resolver';
import { ExecutionRejectionInfo, ExecutionRejectionReason } from '../../models/execution';
import { UsageStatisticResolver } from '../resolver/usage-statistic-resolver';
import { Plans } from '../../models/plans';

export class HasCreditsLeftRule implements ValidationRule {

  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    if (!resolves.has(UsageStatisticResolver)) {
      throw new Error('Missing resoler: UsageStatisticResolver');
    }

    return Observable.forkJoin(resolves.get(UsageStatisticResolver), resolves.get(UserResolver))
      .map(([statistic, user]) => {
        const isAdmin = user.plan.plan_id === Plans.Admin;

        return isAdmin ? true : !statistic || statistic.secondsLeft <= 0 ?
          new ExecutionRejectionInfo(ExecutionRejectionReason.OutOfCredits, 'User is out of credits') :
          true;
      });
  }
}
