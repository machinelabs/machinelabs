import { Observable } from '@reactivex/rxjs'
import { ValidationRule } from './rule';
import { Invocation } from '../../models/invocation';
import { ValidationResult } from '../validation-result';
import { ExecutionRejectionInfo, ExecutionRejectionReason } from '../../models/execution';
import { UsageStatisticResolver } from '../resolver/usage-statistic-resolver';

export class HasCreditsLeftRule implements ValidationRule {

  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    if (!resolves.has(UsageStatisticResolver)) {
      throw new Error('Missing resoler: UsageStatisticResolver');
    }

    return resolves
      .get(UsageStatisticResolver)
      .map(statistic => !statistic || statistic.secondsLeft <= 0 ?
        new ExecutionRejectionInfo(ExecutionRejectionReason.OutOfCredits, 'User is out of credits') :
        true);
  }
}
