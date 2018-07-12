import { Observable } from 'rxjs';
import { mergeScan, map } from 'rxjs/operators';
import { ExecutionMessage } from '../../models/execution';
import { RecycleAccumulator } from './recycle-accumulator';
import { MessageRepository } from '../message-repository';

export interface RecycleConfig {
  messageRepository: MessageRepository;
  getMessageTimeout: number;
  triggerIndex: number;
  triggerIndexStep: number;
  tailLength: number;
  deleteCount: number;
}

export class RecycleService {
  constructor(private config: RecycleConfig) {}

  watch(executionId: string, messages: Observable<ExecutionMessage>) {
    return messages.pipe(
      mergeScan(
        (acc: RecycleAccumulator, message: ExecutionMessage) => acc.pass(acc, message),
        new RecycleAccumulator(executionId, this.config),
        1
      ),
      map(val => val.message)
    );
  }
}
