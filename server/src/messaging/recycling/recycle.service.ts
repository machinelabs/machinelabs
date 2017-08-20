import { Observable } from '@reactivex/rxjs';
import { ExecutionMessage } from '../../models/execution';
import { RecycleAccumulator } from './recycle-accumulator';
import { MessageRepository } from '../message-repository';

export interface RecycleConfig {
  messageRepository: MessageRepository;
  getMessageTimeout: number;
  bulkUpdateTimeout: number;
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
        console.log(`Execution ${executionId}: Passing message at ${Date.now()}`);
        console.log(message.data);
        return acc.pass(acc, message);
      }, new RecycleAccumulator(executionId, this.config), 1)
      .map(val => val.message)
  }
}