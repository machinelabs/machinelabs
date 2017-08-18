import 'jest';

import { recycleCmdFactory, RecycleCmdInfo } from './recycle-cmd-factory';
import { ExecutionMessage, MessageKind } from '../../models/execution';

let toSnapshot = (v:any) => ({ val: () => v})

describe('createRecycleCommand()', () => {
  it('should generate command to replace messages at the beginning', () => {

    let msgs: Array<any> = [
      toSnapshot({ id: '1', index: 0, virtual_index: 0, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionStarted }),
      toSnapshot({ id: '2', index: 1, virtual_index: 1, data: '', timestamp: Date.now(), kind: MessageKind.Stdout }),
      toSnapshot({ id: '3', index: 2, virtual_index: 2, data: '', timestamp: Date.now(), kind: MessageKind.Stdout }),
      toSnapshot({ id: '4', index: 3, virtual_index: 3, data: '', timestamp: Date.now(), kind: MessageKind.Stdout }),
      toSnapshot({ id: '5', index: 4, virtual_index: 4, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionFinished })
    ];

    let cmd = recycleCmdFactory('1', msgs, 3);

    let info: RecycleCmdInfo = {
      cmd: {
        '/executions/1/messages/1': null,
        '/executions/1/messages/2': null,
        '/executions/1/messages/3': null,
        '/executions/1/messages/4/index': 0,
        '/executions/1/messages/5/index': 1
      },
      total: 5,
      removed: 3,
      patched: 2,
      rest: 0
    };

    expect(cmd).toEqual(info);
  });

  it('should generate command to replace messages somewhere in the middle', () => {

    let msgs: Array<any> = [
      toSnapshot({ id: '503', index: 502, virtual_index: 1002, data: '', timestamp: Date.now(), kind: MessageKind.Stdout }),
      toSnapshot({ id: '504', index: 503, virtual_index: 1003, data: '', timestamp: Date.now(), kind: MessageKind.Stdout }),
      toSnapshot({ id: '505', index: 504, virtual_index: 1004, data: '', timestamp: Date.now(), kind: MessageKind.Stdout }),
      toSnapshot({ id: '506', index: 505, virtual_index: 1005, data: '', timestamp: Date.now(), kind: MessageKind.Stdout }),
      toSnapshot({ id: '507', index: 506, virtual_index: 1006, data: '', timestamp: Date.now(), kind: MessageKind.Stdout })
    ];

    let cmd = recycleCmdFactory('1', msgs, 3);

    let info: RecycleCmdInfo = {
      cmd: {
        '/executions/1/messages/503': null,
        '/executions/1/messages/504': null,
        '/executions/1/messages/505': null,
        '/executions/1/messages/506/index': 502,
        '/executions/1/messages/507/index': 503
      },
      total: 5,
      removed: 3,
      patched: 2,
      rest: 0
    };

    expect(cmd).toEqual(info);
  });

  it('should ignore messages without index', () => {

    let msgs: Array<any> = [
      toSnapshot({ id: '503', index: 502, virtual_index: 1002, data: '', timestamp: Date.now(), kind: MessageKind.Stdout }),
      toSnapshot({ id: '504', index: 503, virtual_index: 1003, data: '', timestamp: Date.now(), kind: MessageKind.Stdout }),
      toSnapshot({ id: '505', index: 504, virtual_index: 1004, data: '', timestamp: Date.now(), kind: MessageKind.Stdout }),
      toSnapshot({ id: '506', index: null, virtual_index: 1005, data: '', timestamp: Date.now(), kind: MessageKind.Stdout }),
      toSnapshot({ id: '507', index: 506, virtual_index: 1006, data: '', timestamp: Date.now(), kind: MessageKind.Stdout })
    ];

    let cmd = recycleCmdFactory('1', msgs, 3);

    let info: RecycleCmdInfo = {
      cmd: {
        '/executions/1/messages/503': null,
        '/executions/1/messages/504': null,
        '/executions/1/messages/505': null,
        '/executions/1/messages/507/index': 503
      },
      total: 5,
      removed: 3,
      patched: 1,
      rest: 1
    };

    expect(cmd).toEqual(info);
  });
});
