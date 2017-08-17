import { Observable } from '@reactivex/rxjs';
import { recycleCmdFactory, RecycleCmdInfo } from './recycle-cmd-factory';
import { db, dbRefBuilder } from '../ml-firebase/db';

export class RecycleConfig {
  constructor(public fromVirtualIndex: number,
              public toVirtualIndex: number,
              public deleteCount: number) {}

    get recycleRangeCount () {
      return this.toVirtualIndex - this.fromVirtualIndex + 1;
    }

    get recyclePatchCount () {
      return this.recycleRangeCount - this.deleteCount;
    }
}

export interface RecycleResult {
  config: RecycleConfig;
  cmdInfo: RecycleCmdInfo,
  executed: boolean
}

export function recycle(executionId: string, config: RecycleConfig): Observable<RecycleResult> {

  console.log(`cleanup called with from: ${config.fromVirtualIndex} to: ${config.toVirtualIndex} and del ${config.deleteCount}`)
  return dbRefBuilder
    .executionMessagesRef(executionId)
    .orderByChild('virtual_index')
    .startAt(config.fromVirtualIndex)
    .endAt(config.toVirtualIndex)
    .onceValue()
    .flatMap(snapshot => {

      let cmdInfo = recycleCmdFactory(executionId, snapshot, config.deleteCount);
      if (cmdInfo.patched !== config.recyclePatchCount || cmdInfo.removed !== config.deleteCount) {
        return Observable.of({
          config,
          cmdInfo,
          executed: false
        });
      }

      return dbRefBuilder.rootRef()
                         .update(cmdInfo.cmd)
                         .map(_ => ({ config, cmdInfo, executed: true }));
    });
}