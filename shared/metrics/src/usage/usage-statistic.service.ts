import { Observable } from '@reactivex/rxjs';
import { ObservableDbRef, DbRefBuilder, DateUtil } from '@machinelabs/core';
import { ShortMonth, toShortMonth, HardwareType } from '@machinelabs/models';
import { CostCalculator } from '../costs/cost-calculator';
import { UsageStatistic } from './usage-statistic';

// Give everyone 72 CPU hours per month
const FREE_MONTHLY_CPU_SECONDS = 72 * 60 * 60;
const FREE_MONTHLY_GPU_SECONDS = 20 * 60 * 60;

export class UsageStatisticService {

  constructor(private costCalculator: CostCalculator, private db: DbRefBuilder) {

  }

  getStatisticForCurrentMonth(userId: string) {
    return this.getStatistic(userId, DateUtil.getCurrentUtcYear(), DateUtil.getCurrentUtcShortMonth());
  }

  getStatistic(userId: string, year: number, month: ShortMonth): Observable<UsageStatistic> {

    let executions$ = Observable.merge(
      this.db.userExecutionsByMonthRef(userId, year, month).onceValue(),
      this.db.userExecutionsLiveRef(userId).onceValue()
      )
      .map(snapshot => snapshot.val())
      .map(val => val ? Object.keys(val) : [])
      .flatMap(executionIds => Observable.from(executionIds)
                                         .flatMap(id => this.db.executionRef(id).onceValue()))
      .map(snapshot => snapshot.val())
      .filter(execution => execution !== null);

    return this.costCalculator.calc(executions$)
                              .map(costReport => ({
                                  costReport: costReport,
                                  cpuSecondsLeft: FREE_MONTHLY_CPU_SECONDS - costReport.getSecondsPerHardware(HardwareType.CPU),
                                  gpuSecondsLeft: FREE_MONTHLY_GPU_SECONDS - costReport.getSecondsPerHardware(HardwareType.GPU)
                                }));
  }
}
