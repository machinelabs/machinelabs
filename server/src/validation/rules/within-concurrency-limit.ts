import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ValidationRule } from './rule';
import { Invocation, ExecutionRejectionInfo, ExecutionRejectionReason, PlanCredits } from '@machinelabs/models';
import { ValidationResult } from '../validation-result';
import { dbRefBuilder } from '../../ml-firebase';
import { UserResolver } from '../resolver/user-resolver';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ExtendedUser } from '../../models/user';

export class WithinConcurrencyLimit implements ValidationRule {

  check(invocation: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    if (!resolves.has(UserResolver)) {
      throw new Error('Missing resolver: UserResolver');
    }

    return forkJoin(
        resolves.get(UserResolver),
        dbRefBuilder.userExecutionsLiveRef(invocation.user_id).onceValue()
      )
      .pipe(
        map(([user, liveSnapshot]) => {
          let extendedUser: ExtendedUser = user;
          let liveEntries = liveSnapshot.val();
          let plan = PlanCredits.get(extendedUser.plan.plan_id);

          let runningExecutionCount = Object.keys(liveEntries || {}).length;

          return runningExecutionCount >= plan.maxExecutionConcurrency ?
            new ExecutionRejectionInfo(ExecutionRejectionReason.ExceedsMaximumConcurrency, 'User has too many parallel executions') :
            true;
        })
      );
  }
}
