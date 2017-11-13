import { Observable } from 'rxjs/Observable';
import { InvocationLab } from './invocation';
import { ExecutionRejectionInfo } from '@machinelabs/models';

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
  Stdout = 'stdout',
  Stderr = 'stderr',
  ExecutionStarted = 'started',
  ExecutionFinished = 'finished',
  ExecutionRejected = 'rejected'
}

export interface ExecutionMessage {
  id: string;
  index: number;
  data: string | ExecutionRejectionInfo;
  kind: MessageKind;
  timestamp: number;
  terminal_mode: boolean;
}

export interface ExecutionWrapper {
  execution: Observable<Execution>;
  messages: Observable<ExecutionMessage>;
  controlMessages: Observable<ExecutionMessage>;
}

export interface ExecutionInvocationInfo {
  executionId: string;
  persistent: boolean;
  rejection: ExecutionRejectionInfo;
}
