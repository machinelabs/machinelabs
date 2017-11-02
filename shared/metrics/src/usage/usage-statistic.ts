import { CostReport } from '../costs/cost-report';

export interface UsageStatistic {
  costReport: CostReport;
  secondsLeft: number;
}
