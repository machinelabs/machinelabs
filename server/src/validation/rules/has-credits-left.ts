import { Observable } from '@reactivex/rxjs';
import { ValidationRule } from './rule';
import { Invocation, HardwareType, ExecutionRejectionInfo, ExecutionRejectionReason, PlanId } from '@machinelabs/models';
import { ValidationResult } from '../validation-result';
import { UserResolver } from '../resolver/user-resolver';
import { CostReportResolver } from '../resolver/usage-statistic-resolver';
import { LabConfigResolver } from '../resolver/lab-config-resolver';
import { UsageStatistic, UsageStatisticService, CostReport } from '@machinelabs/metrics';

export class HasCreditsLeftRule implements ValidationRule {

  constructor(private usageStatisticService: UsageStatisticService) {}


  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    if (!resolves.has(CostReportResolver)) {
      throw new Error('Missing resoler: CostReportResolver');
    }

    return Observable.forkJoin(resolves.get(CostReportResolver),
                               resolves.get(UserResolver),
                               resolves.get(LabConfigResolver))
      .map(([costReport, user, config]) => {
        const isAdmin = user.plan.plan_id === PlanId.Admin;
        const hardwareType = config.hardwareType;
        const statistic: UsageStatistic = this.usageStatisticService.calculateStatisticForPlan(user.common.id, user.plan.plan_id, costReport);

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
