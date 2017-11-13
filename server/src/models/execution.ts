import { ExecutionRejectionInfo } from '@machinelabs/models';

export enum MessageKind {
  Stdout = 'stdout',
  Stderr = 'stderr',
  ExecutionStarted = 'started',
  ExecutionFinished = 'finished',
  ExecutionRejected = 'rejected'
}

export interface ExecutionMessage {
  id?: string;
  index?: number;
  virtual_index?: number;
  data: string | ExecutionRejectionInfo;
  kind: MessageKind;
  timestamp?: number | object;
  terminal_mode: boolean;
}

export enum ExecutionRejectionReason {
  NoAnonymous,
  NoPlan,
  InvalidConfig,
  OutOfCredits,
  ExceedsMaximumConcurrency,
  OverCapacity,
  HardwareTypeNotPermitted
}

export function toMessageKind(kind: string) {
  return kind.toLowerCase() === 'stderr' ? MessageKind.Stderr : MessageKind.Stdout;
}
