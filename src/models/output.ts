export enum OutputKind {
  Stdout,
  Stderr,
  ProcessFinished,
  OutputRedirected,
  ExecutionRejected
}

export interface OutputMessage {
  id?: string,
  data: string,
  kind: OutputKind,
  timestamp?: number | object
}

export function toOutputKind(kind: string) {
  switch (kind.toLowerCase()) {
    case 'stdout':
      return OutputKind.Stdout;
    case 'stderr':
      return OutputKind.Stderr;
    case 'process_finished':
      return OutputKind.ProcessFinished;
    case 'output_redirected':
      return OutputKind.OutputRedirected
    default:
      return OutputKind.Stdout;
  }
}