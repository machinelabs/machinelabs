import { Lab } from './lab';

export enum ExecutionStatus {
  Pristine,
  Executing,
  Finished,
  Stopped,
  Failed
}

export interface Execution {
  id: string;
  cache_hash: string;
  started_at: number;
  finished_at: number,
  server_info: string
  user_id: string;
  lab: Lab;
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
  id?: string,
  data: string | ExecutionRejectionInfo,
  kind: MessageKind,
  timestamp?: number | object
}

export enum ExecutionRejectionReason {
  NoAnonymous,
  NoPlan,
  InvalidConfig
}

export class ExecutionRejectionInfo {
  constructor(public reason: ExecutionRejectionReason,
              public message: string){}
}

export function toMessageKind(kind: string) {
  return kind.toLowerCase() === 'stderr' ? MessageKind.Stderr : MessageKind.Stdout;
}
