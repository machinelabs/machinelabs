export enum OutputKind {
  Stdout,
  Stderr,
  ProcessFinished,
  OutputRedirected
}

export interface OutputMessage {
  id: string,
  data: string,
  kind: OutputKind,
  timestamp: number
}