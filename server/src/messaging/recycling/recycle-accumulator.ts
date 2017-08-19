import { Observable } from '@reactivex/rxjs';
import { ExecutionMessage } from '../../models/execution';
import { RecycleCmdInfo, recycleCmdFactory } from './recycle-cmd-factory';
import { MessageRepository } from '../message-repository';
import { RecycleConfig } from './recycle.service';

export class RecycleAccumulator {

  index = 0;
  virtualIndex = 0;
  message: ExecutionMessage = null;

  constructor(private executionId: string, private config: RecycleConfig) {}

  pass (acc: RecycleAccumulator, message: ExecutionMessage): Observable<RecycleAccumulator> {
    return this.invoke(acc.clone(), message);
  }

  private invoke (acc: RecycleAccumulator, message: ExecutionMessage): Observable<RecycleAccumulator> {

    Object.assign(message, { 
      index: acc.index,
      virtual_index: acc.virtualIndex
    });

    acc.message = message;
    
    return this.recycleOrContinue(acc)
               .map((currentAcc:RecycleAccumulator) => {
                  currentAcc.index++;
                  currentAcc.virtualIndex++;
                  return currentAcc;
                });
  }

  private recycleOrContinue(acc: RecycleAccumulator): Observable<RecycleAccumulator> {

    if (acc.index === this.config.triggerIndex) {

      let fromVirtualIndex = acc.virtualIndex - this.config.tailLength;
      let toVirtualIndex = acc.virtualIndex - 1;
      let expectedPatchCount = this.config.tailLength - this.config.deleteCount;


      return this.config
          .messageRepository
          .getMessages(this.executionId, fromVirtualIndex, toVirtualIndex)
          .flatMap(messages => {

            let cmdInfo = recycleCmdFactory(this.executionId, messages, this.config.deleteCount);
            if (cmdInfo.patched === expectedPatchCount && cmdInfo.removed === this.config.deleteCount) {
      
              return this.config.messageRepository
                         .bulkUpdate(cmdInfo.cmd)
                         .map(() => {
                           console.log(`Recycled message space for execution ${this.executionId} at ${Date.now()}`);
                           acc.index = acc.index - this.config.deleteCount;
                           acc.message.index = acc.index;
                           return acc;
                         })
                        .catch((err) => {
                          console.error(`Unexpected error during bulk update of message recycling for execution ${this.executionId} at ${Date.now()}`);
                          console.error(err);
                          return Observable.of(acc)
                        });
            }

            console.error(`Skipped recycling unexpectedly at ${Date.now()}.`);
            console.log(`patched / expected patched: ${cmdInfo.patched} / ${expectedPatchCount}`);
            console.log(`removed / expected removed: ${cmdInfo.removed} / ${this.config.deleteCount}`);

            return Observable.of(acc);
          })
          .catch(err => {
            console.error(`Unexpected error during 'getMessages' of message recycling for execution ${this.executionId} at ${Date.now()}`);
            console.error(err);

            return Observable.of(acc);
          })
    }

    return Observable.of(acc);
  }


  clone () : RecycleAccumulator {
    let acc = new RecycleAccumulator(this.executionId, this.config);
    acc.index = this.index;
    acc.virtualIndex = this.virtualIndex;
    acc.message = this.message;
    return acc;
  }
}