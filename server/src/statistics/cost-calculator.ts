import { Execution } from '@machinelabs/core';
import { Observable } from '@reactivex/rxjs';
import { HardwareType } from '../models/server';
import { COST_PER_SECOND_PER_TYPE } from './costs';
import { CostReport } from './cost-report';

export class CostCalculator {
  public calc(executions: Observable<Execution>): Observable<CostReport> {
    return executions
            .scan((acc: CostReport, execution: Execution) => {

              let timeSpent = this.msToSecond((execution.finished_at || Date.now()) - execution.started_at);

              let secondsPerHardware = acc.secondsPerHardware.get(execution.hardware_type) + timeSpent;
              acc.secondsPerHardware.set(execution.hardware_type, secondsPerHardware);

              let costsPerHardware = +(secondsPerHardware * COST_PER_SECOND_PER_TYPE.get(execution.hardware_type)).toFixed(2);
              acc.costPerHardware.set(execution.hardware_type, costsPerHardware);

              acc.totalSeconds = acc.totalSeconds + timeSpent;

              acc.totalCost = Array.from(acc.costPerHardware)
                                   .map(([key, val]) => val)
                                   .reduce((prev, current) => prev + current, 0);

              return acc;
            }, new CostReport())
            .last(null, null, new CostReport());
  }

  private msToSecond(ms: number) {
    return Math.round(ms / 1000);
  }
}
