import { Observable } from 'rxjs/Observable';
import { Resolver } from './resolver';
import { Invocation } from '@machinelabs/models';
import { UsageStatisticService } from '@machinelabs/metrics';
import { CostReport } from '@machinelabs/metrics';


export class CostReportResolver implements Resolver {

  constructor(private usageStatisticService: UsageStatisticService) {}

  resolve(invocation: Invocation) {
    return this.usageStatisticService.getCostReportForCurrentMonth(invocation.user_id);
  }
}
