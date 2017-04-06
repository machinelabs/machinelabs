export enum OutputKind {
  Stdout,
  Stderr,
  ExecutionFinished,
  OutputRedirected,
  ExecutionRejected
}

export interface OutputMessage {
  id: string,
  data: string,
  kind: OutputKind,
  timestamp: number
}