import { AbstractValidationError } from '../validation/validation-result';
import { HardwareType } from './server';

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
}

export enum ExecutionRejectionReason {
  NoAnonymous,
  NoPlan,
  InvalidConfig,
  OutOfCredits,
  ExceedsMaximumConcurrency,
  OverCapacity
}

export class ExecutionRejectionInfo extends AbstractValidationError {
  constructor(public reason: ExecutionRejectionReason,
              public message: string) {
                super(message);
              }
}

export function toMessageKind(kind: string) {
  return kind.toLowerCase() === 'stderr' ? MessageKind.Stderr : MessageKind.Stdout;
}
