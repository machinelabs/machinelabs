import { Observable } from '@reactivex/rxjs';
import { Resolver } from './resolver';
import { Invocation } from '../../models/invocation';
import { UsageStatisticService } from '@machinelabs/metrics';
import { UsageStatistic } from '@machinelabs/metrics';


export class UsageStatisticResolver implements Resolver {

  constructor(private usageStatisticService: UsageStatisticService) {}

  resolve(invocation: Invocation) {
    return this.usageStatisticService.getStatisticForCurrentMonth(invocation.user_id);
  }
}
