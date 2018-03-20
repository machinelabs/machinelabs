import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { merge } from 'rxjs/observable/merge';
import { from } from 'rxjs/observable/from';
import { map, mergeMap, filter } from 'rxjs/operators';
import { ObservableDbRef, DbRefBuilder, DateUtil } from '@machinelabs/core';
import { ShortMonth, toShortMonth, HardwareType, PlanId, PlanCredits } from '@machinelabs/models';
import { CostCalculator } from '../costs/cost-calculator';
import { CostReport } from '../costs/cost-report';
import { UsageStatistic } from './usage-statistic';
import { LiveMetricsService } from '../live/live-metrics.service';

const hoursToSeconds = (hours: number) => hours * 60 * 60;

export class UsageStatisticService {
  constructor(
    private costCalculator: CostCalculator,
    private liveMetricsService: LiveMetricsService,
    private db: DbRefBuilder
  ) {}

  getUsageStatisticForAllCurrentlyActiveUsers() {
    return this.liveMetricsService
      .getLiveExecutionsRef()
      .onceValue()
      .pipe(
        map(snapshot => snapshot.val()),
        filter(val => !!val),
        mergeMap(val => Object.keys(val)),
        mergeMap(userId => {
          return forkJoin(
            this.db
              .userRef(userId)
              .onceValue()
              .pipe(map(snapshot => snapshot.val())),
            this.getCostReportForCurrentMonth(userId)
          ).pipe(
            map(([fullUser, costReport]) =>
              this.calculateStatisticForPlan(fullUser.common.id, fullUser.plan.plan_id, costReport)
            )
          );
        })
      );
  }

  getUsageStatisticForCurrentMonth(userId: string, planId: PlanId): Observable<UsageStatistic> {
    const costReport$ = this.getCostReportForCurrentMonth(userId);
    return this.calculateStatistic(userId, planId, costReport$);
  }

  getUsageStatistic(userId: string, planId: PlanId, year: number, month: ShortMonth): Observable<UsageStatistic> {
    const costReport$ = this.getCostReport(userId, year, month);
    return this.calculateStatistic(userId, planId, costReport$);
  }

  getCostReportForCurrentMonth(userId: string) {
    return this.getCostReport(userId, DateUtil.getCurrentUtcYear(), DateUtil.getCurrentUtcShortMonth());
  }

  getCostReport(userId: string, year: number, month: ShortMonth): Observable<CostReport> {
    const executions$ = merge(
      this.db.userExecutionsByMonthRef(userId, year, month).onceValue(),
      this.db.userExecutionsLiveRef(userId).onceValue()
    ).pipe(
      map(snapshot => snapshot.val()),
      map(val => (val ? Object.keys(val) : [])),
      mergeMap(executionIds => from(executionIds).pipe(mergeMap(id => this.db.executionRef(id).onceValue()))),
      map(snapshot => snapshot.val()),
      filter(execution => execution !== null)
    );

    return this.costCalculator.calc(executions$);
  }

  calculateStatistic(userId: string, planId: PlanId, costReport: Observable<CostReport>) {
    return costReport.pipe(map(report => this.calculateStatisticForPlan(userId, planId, report)));
  }

  calculateStatisticForPlan(userId: string, planId: PlanId, report: CostReport): UsageStatistic {
    const credits = PlanCredits.get(planId);

    if (!credits || !report) {
      return null;
    }

    return {
      userId: userId,
      planId: planId,
      costReport: report,
      cpuSecondsLeft: hoursToSeconds(credits.cpuHoursPerMonth) - report.getSecondsPerHardware(HardwareType.CPU),
      gpuSecondsLeft: hoursToSeconds(credits.gpuHoursPerMonth) - report.getSecondsPerHardware(HardwareType.GPU)
    };
  }
}
