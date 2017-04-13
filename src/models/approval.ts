import { Run } from './run';

export interface Approval {
  canRun: boolean;
  maxTime: number,
  message: string;
  run: Run;
}