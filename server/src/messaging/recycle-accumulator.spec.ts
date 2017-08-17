import 'jest';

import { Observable } from '@reactivex/rxjs';
import { RecycleAccumulator } from './recycle-accumulator';
import { ExecutionMessage, MessageKind } from '../models/execution';
import { recycleCmdFactory } from './recycle-cmd-factory';
import { RecycleConfig } from "src/messaging/recycle";

let toSnapshot = (v:any) => ({ val: () => v})

describe('createRecycleCommand()', () => {
  it('should call correct delete command', () => {

    let msgs: Array<any> = [
      { id: '1', index: 0, virtual_index: 0, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionStarted },
      { id: '2', index: 1, virtual_index: 1, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      // Next three lines will be in the recycle range
      { id: '3', index: 2, virtual_index: 2, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '4', index: 3, virtual_index: 3, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '5', index: 4, virtual_index: 4, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      // The following message will trigger the recycling but it won't be in the db
      // at the time where the recycling begins. Everything above will be in the db.
      { id: '6', index: 5, virtual_index: 5, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '7', index: 6, virtual_index: 6, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionFinished }
    ];

    const deleteFn = jest.fn();

    let expectedDbCommand: any =  {
      cmd: {
        '/executions/1/messages/3': null, 
        '/executions/1/messages/4': null, 
        '/executions/1/messages/5/index': 2
      }, 
      patched: 1, 
      removed: 2, 
      rest: 0, 
      total: 3
    };

    deleteFn.mockImplementation((executionId: string, config: RecycleConfig) => {
      
      let snapshot = msgs.filter(msg => msg.virtual_index >= config.fromVirtualIndex && msg.virtual_index <= config.toVirtualIndex)
                         .map(toSnapshot);

      let cmdInfo = recycleCmdFactory(executionId, snapshot, config.deleteCount);

      expect(cmdInfo).toEqual(expectedDbCommand);

      console.log(cmdInfo);
      return Observable.of({
        cmdInfo,
        config,
        executed: true
      });
    })

    let outgoingAcc: Array<RecycleAccumulator> = [];

    return Observable
      .from(msgs)
      .mergeScan((acc, message) => acc.pass(acc, message), new RecycleAccumulator('1', deleteFn, 5, 3, 2))
      .do(val => outgoingAcc.push(val))
      .toPromise()
      .then(() => {
        
        expect(outgoingAcc[0].message.index).toBe(0);
        expect(outgoingAcc[0].message.virtual_index).toBe(0);

        expect(outgoingAcc[1].message.index).toBe(1);
        expect(outgoingAcc[1].message.virtual_index).toBe(1);
        
        expect(outgoingAcc[2].message.index).toBe(2);
        expect(outgoingAcc[2].message.virtual_index).toBe(2);
        
        expect(outgoingAcc[3].message.index).toBe(3);
        expect(outgoingAcc[3].message.virtual_index).toBe(3);
        
        // This message will be changed directly in the db so it's not our business here
        expect(outgoingAcc[4].message.index).toBe(4);
        expect(outgoingAcc[4].message.virtual_index).toBe(4);
        
        // Index got corrected here because two previous messages were dropped
        expect(outgoingAcc[5].message.index).toBe(3);
        expect(outgoingAcc[5].message.virtual_index).toBe(5);
        
        expect(outgoingAcc[6].message.index).toBe(4);
        expect(outgoingAcc[6].message.virtual_index).toBe(6);
        
        expect(deleteFn.mock.calls).toEqual([['1', {'deleteCount': 2, 'fromVirtualIndex': 2, 'toVirtualIndex': 4}]]);
      });
  });


  it('should abort recycling if cmd show unexpected results', () => {

    let msgs: Array<any> = [
      { id: '1', index: 0, virtual_index: 0, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionStarted },
      { id: '2', index: 1, virtual_index: 1, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '3', index: 2, virtual_index: 2, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '4', index: 3, virtual_index: 3, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '5', index: 4, virtual_index: 4, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '6', index: 5, virtual_index: 5, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '7', index: 6, virtual_index: 6, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionFinished }
    ];

    const deleteFn = jest.fn();

    deleteFn.mockReturnValue(Observable.of({
      executed: false
    }))

    let outgoingAcc: Array<RecycleAccumulator> = [];

    return Observable
      .from(msgs)
      .mergeScan((acc, message) => acc.pass(acc, message), new RecycleAccumulator('1', deleteFn, 5, 3, 2))
      .do(val => outgoingAcc.push(val))
      .toPromise()
      .then(() => {
        
        expect(outgoingAcc[0].message.index).toBe(0);
        expect(outgoingAcc[0].message.virtual_index).toBe(0);

        expect(outgoingAcc[1].message.index).toBe(1);
        expect(outgoingAcc[1].message.virtual_index).toBe(1);
        
        expect(outgoingAcc[2].message.index).toBe(2);
        expect(outgoingAcc[2].message.virtual_index).toBe(2);

        expect(outgoingAcc[3].message.index).toBe(3);
        expect(outgoingAcc[3].message.virtual_index).toBe(3);

        expect(outgoingAcc[4].message.index).toBe(4);
        expect(outgoingAcc[4].message.virtual_index).toBe(4);
        
        expect(outgoingAcc[5].message.index).toBe(5);
        expect(outgoingAcc[5].message.virtual_index).toBe(5);
        
        expect(outgoingAcc[6].message.index).toBe(6);
        expect(outgoingAcc[6].message.virtual_index).toBe(6);
        
        expect(deleteFn.mock.calls).toEqual([['1', {'deleteCount': 2, 'fromVirtualIndex': 2, 'toVirtualIndex': 4}]]);
      });
  });
});
