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

export enum ExecutionRejectionReason {
  NoAnonymous,
  NoPlan,
  InvalidConfig,
  OutOfCredits,
  ExceedsMaximumConcurrency,
  OverCapacity,
  HardwareTypeNotPermitted
}

export class ExecutionRejectionInfo {
  constructor(public reason: ExecutionRejectionReason,
              public message: string) {}

  static isOfType(info: any): info is ExecutionRejectionInfo {
    return info.message && info.reason !== undefined;
  }
}
