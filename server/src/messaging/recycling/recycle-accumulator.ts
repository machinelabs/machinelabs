import { Observable, of, timer, throwError } from 'rxjs';
import { map, takeUntil, mergeMap, switchMap, catchError } from 'rxjs/operators';
import { ExecutionMessage } from '../../models/execution';
import { RecycleCmdInfo, recycleCmdFactory } from './recycle-cmd-factory';
import { MessageRepository } from '../message-repository';
import { RecycleConfig } from './recycle.service';

export class RecycleAccumulator {
  index = 0;
  virtualIndex = 0;
  triggerIndex = 0;
  message: ExecutionMessage = null;

  constructor(private executionId: string, private config: RecycleConfig) {
    this.triggerIndex = config.triggerIndex;
  }

  pass(acc: RecycleAccumulator, message: ExecutionMessage): Observable<RecycleAccumulator> {
    return this.invoke(acc.clone(), message);
  }

  private invoke(acc: RecycleAccumulator, message: ExecutionMessage): Observable<RecycleAccumulator> {
    Object.assign(message, {
      index: acc.index,
      virtual_index: acc.virtualIndex
    });

    acc.message = message;

    return this.recycleOrContinue(acc).pipe(
      map((currentAcc: RecycleAccumulator) => {
        currentAcc.index++;
        currentAcc.virtualIndex++;
        return currentAcc;
      })
    );
  }

  private recycleOrContinue(acc: RecycleAccumulator): Observable<RecycleAccumulator> {
    if (acc.index === acc.triggerIndex) {
      const recycleId = Date.now();

      console.log(`RecycleId ${recycleId} at ${Date.now()}: Entering recycle phase`);

      const fromVirtualIndex = acc.virtualIndex - this.config.tailLength;
      const toVirtualIndex = acc.virtualIndex - 1;
      const expectedPatchCount = this.config.tailLength - this.config.deleteCount;

      return this.config.messageRepository.getMessages(this.executionId, fromVirtualIndex, toVirtualIndex).pipe(
        takeUntil(timer(this.config.getMessageTimeout).pipe(switchMap(() => throwError(new Error('Timeout'))))),
        mergeMap(messages => {
          const cmdInfo = recycleCmdFactory(this.executionId, messages, this.config.deleteCount);
          if (cmdInfo.patched === expectedPatchCount && cmdInfo.removed === this.config.deleteCount) {
            console.log(
              `RecycleId ${recycleId} at ${Date.now()}: About to bulk update messages to recycled space for execution ${
                this.executionId
              }`
            );

            this.config.messageRepository.bulkUpdate(cmdInfo.cmd).subscribe(
              () => {
                console.log(
                  `RecycleId ${recycleId} at ${Date.now()}: Bulk update completed for execution ${this.executionId}`
                );
              },
              err => {
                // Not exactly sure what we should do here. We need to take this into account for
                // the index somehow. But I don't know yet if we would ever run into this with the
                // Realtime API.
                console.error(
                  `RecycleId ${recycleId} at ${Date.now()}: Unexpected error during bulk update of message recycling for execution ${
                    this.executionId
                  }`
                ); // tslint:disable-line:max-line-length
                console.error(err);
              }
            );

            console.log(`RecycleId ${recycleId} at ${Date.now()}: Sent bulk update for execution ${this.executionId}`);
            acc.index = acc.index - this.config.deleteCount;
            acc.message.index = acc.index;

            return of(acc);
          }

          console.error(`RecycleId ${recycleId} at ${Date.now()}: Skipped recycling unexpectedly`);
          console.error(`patched / expected patched: ${cmdInfo.patched} / ${expectedPatchCount}`);
          console.error(`removed / expected removed: ${cmdInfo.removed} / ${this.config.deleteCount}`);

          this.increaseTriggerIndex(acc);
          return of(acc);
        }),
        catchError(err => {
          console.error(
            `RecycleId ${recycleId}  at ${Date.now()}: Unexpected error during 'getMessages' of message recycling for execution ${
              this.executionId
            }`
          );
          console.error(err);

          this.increaseTriggerIndex(acc);
          return of(acc);
        })
      );
    }

    return of(acc);
  }

  private increaseTriggerIndex(acc: RecycleAccumulator) {
    acc.triggerIndex = acc.triggerIndex + this.config.triggerIndexStep;
  }

  clone(): RecycleAccumulator {
    const acc = new RecycleAccumulator(this.executionId, this.config);
    acc.index = this.index;
    acc.virtualIndex = this.virtualIndex;
    acc.message = this.message;
    acc.triggerIndex = this.triggerIndex;
    return acc;
  }
}
