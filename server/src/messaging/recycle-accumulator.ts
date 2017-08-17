import { Observable } from '@reactivex/rxjs';
import { ExecutionMessage } from '../models/execution';
import { RecycleCmdInfo } from './recycle-cmd-factory';
import { RecycleConfig, RecycleResult } from './recycle';

export class RecycleAccumulator {

  index = 0;
  virtualIndex = 0;
  message: ExecutionMessage = null;

  constructor(private executionId: string, 
              private recycleFn: any,
              private recycleTriggerIndex: number,
              private tailLength: number,
              private deleteCount: number) {

  }

  pass (acc: RecycleAccumulator, message: ExecutionMessage): Observable<RecycleAccumulator> {
    return this.invoke(acc.clone(), message);
  }

  private invoke (acc: RecycleAccumulator, message: ExecutionMessage): Observable<RecycleAccumulator> {

    Object.assign(message, { 
      index: acc.index,
      virtual_index: acc.virtualIndex
    });

    acc.message = message;
    let acc$ = acc.index === this.recycleTriggerIndex ?
               this.recycleFn(this.executionId, new RecycleConfig(acc.virtualIndex - this.tailLength,
                                                                  acc.virtualIndex - 1,
                                                                  this.deleteCount))
                .map((result: RecycleResult) => {
                  if (result.executed) {
                    acc.index = acc.index - this.deleteCount;
                    acc.message.index = acc.index;
                    console.log(`corrected index to ${acc.index} at msg.virtual_index ${acc.message.virtual_index}`);
                  }

                  return acc;
                }) : Observable.of(acc);

    return acc$.map((a:RecycleAccumulator) => {
      a.index++;
      a.virtualIndex++;
      return a;
    });
  }

  clone () : RecycleAccumulator {
    let acc = new RecycleAccumulator(this.executionId,
                                     this.recycleFn,
                                     this.recycleTriggerIndex,
                                     this.tailLength,
                                     this.deleteCount);
    acc.index = this.index;
    acc.virtualIndex = this.virtualIndex;
    acc.message = this.message;
    return acc;
  }
}