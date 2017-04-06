export enum OutputKind {
  Stdout,
  Stderr,
  ProcessFinished,
  OutputRedirected,
  ExecutionRejected
}

export interface OutputMessage {
  id: string,
  data: string,
  kind: OutputKind,
  timestamp: number
}