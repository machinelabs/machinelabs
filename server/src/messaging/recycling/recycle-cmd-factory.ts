import { ExecutionMessage } from '../../models/execution';
import isNumber = require('lodash.isnumber');

export interface ForeEachable {
  forEach(fn: (val: any) => boolean| void): void;
}

export interface RecycleCmdInfo {
  cmd: object;
  total: number;
  removed: number;
  patched: number;
  rest: number;
}

export function recycleCmdFactory(executionId: string, msgs: ForeEachable, deleteCount: number): RecycleCmdInfo {
  let cmd = {};

  let index = 0;
  let removeCount = 0;
  let patchCount = 0;

  msgs.forEach(snapshot => {
    let msg = snapshot.val();
    if (index + 1 <= deleteCount) {
      cmd[`/executions/${executionId}/messages/${msg.id}`] = null;
      removeCount++;
    } else if (isNumber(msg.index)) {
      cmd[`/executions/${executionId}/messages/${msg.id}/index`] = msg.index - removeCount;
      patchCount++;
    }

    index++;
  });

  return {
    cmd: cmd,
    total: index,
    removed: removeCount,
    patched: patchCount,
    // A rest can only happen if there are messages without index
    rest: index - removeCount - patchCount
  };
}
