import { HardwareType } from './server';
import { Lab } from './lab';

export enum ExecutionStatus {
  Pristine = 'pristine',
  Executing = 'executing',
  Finished = 'finished',
  Stopped = 'stopped',
  Failed = 'failed'
}

export interface Execution {
  id: string;
  cache_hash: string;
  started_at: number;
  finished_at: number;
  server_info: string;
  hardware_type: HardwareType;
  user_id: string;
  lab: Lab;
  status: ExecutionStatus;
}