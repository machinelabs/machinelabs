import { Observable } from '@reactivex/rxjs'
import { Resolver } from './resolver';
import { Invocation } from '../../models/invocation';
import { UsageStatisticService } from '../../statistics/usage-statistic.service';
import { UsageStatistic } from '../../statistics/usage-statistic';


export class UsageStatisticResolver implements Resolver {

  constructor(private usageStatisticService: UsageStatisticService) {}

  resolve(invocation: Invocation) {
    return this.usageStatisticService.getStatisticForCurrentMonth(invocation.user_id);
  }
}