export enum ExecutionStatus {
  Pristine,
  Executing,
  Finished,
  Stopped,
  Failed
}

export interface Execution {
  id: string;
  file_set_hash: string;
  started_at: number;
  finished_at: number,
  server_info: string
  user_id: string;
  lab_id: string;
  status: ExecutionStatus;
}

export enum MessageKind {
  Stdout,
  Stderr,
  ExecutionFinished,
  OutputRedirected,
  ExecutionRejected
}

export interface ExecutionMessage {
  id?: string,
  data: string,
  kind: MessageKind,
  timestamp?: number | object
}

export function toMessageKind(kind: string) {
  switch (kind.toLowerCase()) {
    case 'stdout':
      return MessageKind.Stdout;
    case 'stderr':
      return MessageKind.Stderr;
    case 'process_finished':
      return MessageKind.ExecutionFinished;
    case 'output_redirected':
      return MessageKind.OutputRedirected
    default:
      return MessageKind.Stdout;
  }
}
