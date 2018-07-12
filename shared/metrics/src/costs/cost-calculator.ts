import { Execution, HardwareType } from '@machinelabs/models';
import { Observable } from 'rxjs';
import { scan, last } from 'rxjs/operators';
import { COST_PER_SECOND_PER_TYPE } from './costs';
import { CostReport } from './cost-report';

export class CostCalculator {
  public calc(executions: Observable<Execution>): Observable<CostReport> {
    return executions.pipe(
      scan((acc: CostReport, execution: Execution) => {
        const timeSpent = this.msToSecond((execution.finished_at || Date.now()) - execution.started_at);

        // to make all past calculations work
        const hardwareType = <HardwareType>execution.hardware_type.replace('economy', 'cpu');

        const secondsPerHardware = acc.secondsPerHardware.get(hardwareType) + timeSpent;
        acc.secondsPerHardware.set(hardwareType, secondsPerHardware);

        const costsPerHardware = +(secondsPerHardware * COST_PER_SECOND_PER_TYPE.get(hardwareType)).toFixed(2);
        acc.costPerHardware.set(hardwareType, costsPerHardware);

        acc.totalSeconds = acc.totalSeconds + timeSpent;

        acc.totalCost = Array.from(acc.costPerHardware)
          .map(([key, val]) => val)
          .reduce((prev, current) => prev + current, 0);

        return acc;
      }, new CostReport()),
      last(null, new CostReport())
    );
  }

  private msToSecond(ms: number) {
    return Math.round(ms / 1000);
  }
}
