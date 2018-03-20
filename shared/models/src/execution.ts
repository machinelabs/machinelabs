import { HardwareType } from './server';
import { Lab } from './lab';

export enum ExecutionStatus {
  Pristine = 'pristine',
  Executing = 'executing',
  Finished = 'finished',
  Stopped = 'stopped',
  Failed = 'failed'
}

export enum MessageKind {
  Stdout = 'stdout',
  Stderr = 'stderr',
  ExecutionStarted = 'started',
  ExecutionFinished = 'finished',
  ExecutionRejected = 'rejected'
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
  NoAnonymous = 'no_anonymous',
  NoPlan = 'no_plan',
  InvalidConfig = 'invalid_config',
  OutOfCpuCredits = 'out_of_cpu_credits',
  OutOfGpuCredits = 'out_of_gpu_credits',
  ExceedsMaximumConcurrency = 'exceeds_maximum_concurrency',
  OverCapacity = 'over_capacity',
  HardwareTypeNotPermitted = 'hardwaretype_not_permitted',
  InternalError = 'internal_error'
}

export class ExecutionRejectionInfo {
  constructor(public reason: ExecutionRejectionReason, public message: string) {}

  static isOfType(info: any): info is ExecutionRejectionInfo {
    return info.message && info.reason !== undefined;
  }
}
