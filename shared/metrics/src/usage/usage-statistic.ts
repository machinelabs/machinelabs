import { CostReport } from '../costs/cost-report';

export interface UsageStatistic {
  userId: string;
  planId: string;
  costReport: CostReport;
  cpuSecondsLeft: number;
  gpuSecondsLeft: number;
}
