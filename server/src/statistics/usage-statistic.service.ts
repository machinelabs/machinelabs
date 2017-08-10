import { Observable } from '@reactivex/rxjs';
import { ObservableDbRef } from '@machinelabs/core';
import { DateUtil } from '../util/date';
import { ShortMonth, toShortMonth } from '../models/months';
import { dbRefBuilder } from '../ml-firebase';
import { CostCalculator } from './cost-calculator';
import { UsageStatistic } from './usage-statistic';

// Give everyone 72 hours per month
const FREE_MONTHLY_COMPUTATION_SECONDS = 72 * 60 * 60;

export class UsageStatisticService {

  constructor(private costCalculator: CostCalculator) {

  }

  getStatisticForCurrentMonth(userId: string) {
    return this.getStatistic(userId, DateUtil.getCurrentUtcYear(), DateUtil.getCurrentUtcShortMonth());
  }

  getStatistic(userId: string, year: number, month: ShortMonth): Observable<UsageStatistic> {

    let executions$ = Observable.merge(
      dbRefBuilder.userExecutionsByMonthRef(userId, year, month).onceValue(),
      dbRefBuilder.userExecutionsLiveRef(userId).onceValue()
      )
      .map(snapshot => snapshot.val())
      .map(val => val ? Object.keys(val) : [])
      .flatMap(executionIds => Observable.from(executionIds)
                                         .flatMap(id => dbRefBuilder.executionRef(id).onceValue()))
      .map(snapshot => snapshot.val())
      .filter(execution => execution !== null);

    return this.costCalculator.calc(executions$)
                              .map(costReport => ({
                                  costReport: costReport,
                                  secondsLeft: FREE_MONTHLY_COMPUTATION_SECONDS - costReport.totalSeconds
                                }));
  }
}
