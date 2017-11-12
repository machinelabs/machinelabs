import { CostReport } from '../costs/cost-report';

export interface UsageStatistic {
  costReport: CostReport;
  cpuSecondsLeft: number;
  gpuSecondsLeft: number;
}
