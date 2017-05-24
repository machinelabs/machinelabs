export enum ExecutionStatus {
  Pristine,
  Executing,
  Finished,
  Stopped,
  Failed
}

export enum ClientExecutionState {
  Executing,
  NotExecuting
}

export interface Execution {
  id?: string;
  file_set_hash?: string;
  started_at?: number;
  finished_at?: number;
  server_info?: string;
  user_id?: string;
  lab_id?: string;
  redirected?: boolean;
  status: ExecutionStatus;
}

export enum MessageKind {
  Stdout,
  Stderr,
  ExecutionStarted,
  ExecutionFinished,
  OutputRedirected,
  ExecutionRejected
}

export interface ExecutionMessage {
  id: string;
  data: string;
  kind: MessageKind;
  timestamp: number;
}
