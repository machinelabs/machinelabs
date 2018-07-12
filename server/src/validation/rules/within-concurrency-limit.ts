import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidationRule } from './rule';
import { Invocation, ExecutionRejectionInfo, ExecutionRejectionReason, PlanCredits } from '@machinelabs/models';
import { ValidationResult } from '../validation-result';
import { dbRefBuilder } from '../../ml-firebase';
import { UserResolver } from '../resolver/user-resolver';
import { ExtendedUser } from '../../models/user';

export class WithinConcurrencyLimit implements ValidationRule {
  check(invocation: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {
    if (!resolves.has(UserResolver)) {
      throw new Error('Missing resolver: UserResolver');
    }

    return forkJoin(
      resolves.get(UserResolver),
      dbRefBuilder.userExecutionsLiveRef(invocation.user_id).onceValue()
    ).pipe(
      map(([user, liveSnapshot]) => {
        const extendedUser: ExtendedUser = user;
        const liveEntries = liveSnapshot.val();
        const plan = PlanCredits.get(extendedUser.plan.plan_id);

        const runningExecutionCount = Object.keys(liveEntries || {}).length;

        return runningExecutionCount >= plan.maxExecutionConcurrency
          ? new ExecutionRejectionInfo(
              ExecutionRejectionReason.ExceedsMaximumConcurrency,
              'User has too many parallel executions'
            )
          : true;
      })
    );
  }
}
