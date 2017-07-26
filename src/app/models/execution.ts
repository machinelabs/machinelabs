import { Observable } from 'rxjs/Observable';
import { InvocationLab } from './invocation';

export enum ExecutionStatus {
  Pristine = 'pristine',
  Executing = 'executing',
  Finished = 'finished',
  Stopped = 'stopped',
  Failed = 'failed'
}

export interface Execution {
  id?: string;
  cache_hash?: string;
  started_at?: number;
  finished_at?: number;
  server_info?: string;
  user_id?: string;
  lab?: InvocationLab;
  redirected?: boolean;
  status: ExecutionStatus;
  hidden?: boolean;
  name?: string;
}

export enum MessageKind {
  Stdout,
  Stderr,
  ExecutionStarted,
  ExecutionFinished,
  ExecutionRejected
}

export interface ExecutionMessage {
  id: string;
  index: number;
  data: string | ExecutionRejectionInfo;
  kind: MessageKind;
  timestamp: number;
}

export enum ExecutionRejectionReason {
  NoAnonymous,
  NoPlan,
  InvalidConfig,
  OutOfCredits,
  ExceedsMaximumConcurrency
}

export class ExecutionRejectionInfo {

  // we need this because after deserialization from JSON a simple instanceof
  // does not work anymore. TS calls these Type Guards
  // https://www.typescriptlang.org/docs/handbook/advanced-types.html
  static isOfType(info: any): info is ExecutionRejectionInfo {
    return info.message && info.reason !== undefined;
  }

  constructor(public reason: ExecutionRejectionReason,
              public message: string) {}
}

export interface ExecutionWrapper {
  execution: Observable<Execution>;
  messages: Observable<ExecutionMessage>;
}

export interface ExecutionInvocationInfo {
  executionId: string;
  persistent: boolean;
  rejection: ExecutionRejectionInfo;
}
