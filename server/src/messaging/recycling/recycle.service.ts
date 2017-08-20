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
      .mergeScan((acc: RecycleAccumulator, message: ExecutionMessage) => {
        console.log(`Execution ${executionId}: Passing message: ${message.data} at ${Date.now()}`);
        return acc.pass(acc, message);
      }, new RecycleAccumulator(executionId, this.config), 1)
      .map(val => val.message)
  }
}