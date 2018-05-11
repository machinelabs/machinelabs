import { Observable } from 'rxjs';
import { InvocationLab } from './invocation';
import { ExecutionRejectionInfo, ExecutionStatus, MessageKind } from '@machinelabs/models';

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
