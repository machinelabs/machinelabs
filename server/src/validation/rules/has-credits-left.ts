import { Observable } from '@reactivex/rxjs';
import { ValidationRule } from './rule';
import { Invocation, HardwareType, ExecutionRejectionInfo, ExecutionRejectionReason } from '@machinelabs/models';
import { ValidationResult } from '../validation-result';
import { UserResolver } from '../resolver/user-resolver';
import { UsageStatisticResolver } from '../resolver/usage-statistic-resolver';
import { LabConfigResolver } from '../resolver/lab-config-resolver';
import { Plans } from '../../models/plans';
import { UsageStatistic } from '@machinelabs/metrics';

export class HasCreditsLeftRule implements ValidationRule {

  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    if (!resolves.has(UsageStatisticResolver)) {
      throw new Error('Missing resoler: UsageStatisticResolver');
    }

    return Observable.forkJoin(resolves.get(UsageStatisticResolver),
                               resolves.get(UserResolver),
                               resolves.get(LabConfigResolver))
      .map(([_statistic, user, config]) => {
        const isAdmin = user.plan.plan_id === Plans.Admin;
        const hardwareType = config.hardwareType;
        const statistic: UsageStatistic = _statistic;

        if (isAdmin) {
          return true;
        }

        if (!statistic) {
          return new ExecutionRejectionInfo(ExecutionRejectionReason.InternalError, 'Internal Error');
        }

        if ((hardwareType === HardwareType.CPU && statistic.cpuSecondsLeft <= 0)) {
          return new ExecutionRejectionInfo(ExecutionRejectionReason.OutOfCpuCredits, 'User is out of CPU credits');
        }


        if (hardwareType === HardwareType.GPU && statistic.gpuSecondsLeft <= 0) {
          return new ExecutionRejectionInfo(ExecutionRejectionReason.OutOfGpuCredits, 'User is out of GPU credits');
        }

        return true;
      });
  }
}
