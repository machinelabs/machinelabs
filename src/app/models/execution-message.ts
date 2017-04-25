export enum MessageKind {
  Stdout,
  Stderr,
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

