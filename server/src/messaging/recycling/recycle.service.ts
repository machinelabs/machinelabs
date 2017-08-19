import { Observable } from '@reactivex/rxjs';
import { ExecutionMessage } from '../../models/execution';
import { RecycleAccumulator } from './recycle-accumulator';
import { MessageRepository } from '../message-repository';

export interface RecycleConfig {
  messageRepository: MessageRepository;
  triggerIndex: number;
  triggerIndexStep: number;
  tailLength: number;
  deleteCount: number;
}

export class RecycleService {
  constructor(private config: RecycleConfig) {}

  watch(executionId: string, messages: Observable<ExecutionMessage>) {
    return messages
      .mergeScan((acc: RecycleAccumulator, message: ExecutionMessage) =>
        acc.pass(acc, message), new RecycleAccumulator(executionId, {
          messageRepository: this.config.messageRepository,
          triggerIndex: this.config.triggerIndex,
          triggerIndexStep: this.config.triggerIndexStep,
          tailLength: this.config.tailLength,
          deleteCount: this.config.deleteCount
        }), 1)
      .map(val => val.message)
  }
}