import { Observable } from '@reactivex/rxjs';
import { ObservableDbRef } from '../ml-firebase';
import { DateUtil } from '../util/date';
import { ShortMonth, toShortMonth } from '../models/months';
import { DbRefBuilder } from '../ml-firebase/db-ref-builder';
import { CostCalculator } from './cost-calculator';
import { UsageStatistic } from './usage-statistic';

// This is ridiculous low now so that we hopefully hit it soon
// in our daily usage. Should be rather something like 100 once
// we launch private beta. Also, should be read from the db.
const FREE_MONTHLY_USD_CREDIT = 1;

export class UsageStatisticService {
  
  constructor(private costCalculator: CostCalculator, private db = new DbRefBuilder()) {

  }

  getStatisticForCurrentMonth(userId: string) {
    return this.getStatistic(userId, DateUtil.getCurrentUtcYear(), DateUtil.getCurrentUtcShortMonth());
  }

  getStatistic(userId: string, year: number, month: ShortMonth) : Observable<UsageStatistic> {

    let executions$ = Observable.merge(
      this.db.userExecutionsByMonthRef(userId, year, month).onceValue(),
      this.db.userExecutionsLiveRef(userId).onceValue()
      )
      .map(snapshot => snapshot.val())
      .map(val => val ? Object.keys(val) : [])
      .flatMap(executionIds => Observable.from(executionIds)
                                         .flatMap(id => this.db.executionRef(id).onceValue()))
      .map(snapshot => snapshot.val())
      .filter(execution => execution !== null)

      return this.costCalculator.calc(executions$)
                         .map(costReport => ({
                           costReport: costReport,
                           creditsLeft: FREE_MONTHLY_USD_CREDIT - costReport.totalCost
                         }));
  }

}