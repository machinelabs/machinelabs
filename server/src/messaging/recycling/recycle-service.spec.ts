import 'jest';

import { Observable } from '@reactivex/rxjs';
import { RecycleAccumulator } from './recycle-accumulator';
import { ExecutionMessage, MessageKind } from '../../models/execution';
import { recycleCmdFactory } from './recycle-cmd-factory';
import { RecycleService, RecycleConfig } from './recycle.service';

let toSnapshot = (v:any) => ({ val: () => v})

const createGetMessages = (msgs: Array<ExecutionMessage>, delay = 0) => (executionId: string, fromVirtualIndex:number, toVirtualIndex: number) => {
  let msgs$ = Observable.of(msgs.filter(msg => msg.virtual_index >= fromVirtualIndex && msg.virtual_index <= toVirtualIndex)
                           .map(toSnapshot));

  return delay > 0 ? msgs$.delay(delay) : msgs$;
} 

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

    const getMessages = jest.fn(createGetMessages(msgs));

    const bulkUpdate = jest.fn().mockReturnValue(Observable.of({}));

    let mockRepository = { getMessages, bulkUpdate };

    let outboundMsgs: Array<ExecutionMessage> = [];

    let recycleService = new RecycleService({
      messageRepository: mockRepository,
      getMessageTimeout: 1000,
      bulkUpdateTimeout: 1000,
      triggerIndex: 5,
      triggerIndexStep: 1,
      tailLength: 3,
      deleteCount: 2
    });

    return Observable
      .from(msgs)
      .let(msgs => recycleService.watch('1', msgs))
      .do(val => outboundMsgs.push(val))
      .toPromise()
      .then(() => {
        expect(outboundMsgs[0].index).toBe(0);
        expect(outboundMsgs[0].virtual_index).toBe(0);

        expect(outboundMsgs[1].index).toBe(1);
        expect(outboundMsgs[1].virtual_index).toBe(1);

        expect(outboundMsgs[2].index).toBe(2);
        expect(outboundMsgs[2].virtual_index).toBe(2);

        expect(outboundMsgs[3].index).toBe(3);
        expect(outboundMsgs[3].virtual_index).toBe(3);

        // This message will be changed directly in the db so it's not our business here
        expect(outboundMsgs[4].index).toBe(4);
        expect(outboundMsgs[4].virtual_index).toBe(4);

        // Index got corrected here because two previous messages were dropped
        expect(outboundMsgs[5].index).toBe(3);
        expect(outboundMsgs[5].virtual_index).toBe(5);

        expect(outboundMsgs[6].index).toBe(4);
        expect(outboundMsgs[6].virtual_index).toBe(6);

        expect(mockRepository.bulkUpdate.mock.calls)
          .toEqual([[{
            '/executions/1/messages/3': null,
            '/executions/1/messages/4': null,
            '/executions/1/messages/5/index': 2
          }]]);
      });
  });


  it('should skip recycling if number of messages returned from db is unexpected', () => {

    let msgs: Array<any> = [
      { id: '1', index: 0, virtual_index: 0, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionStarted },
      { id: '2', index: 1, virtual_index: 1, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '3', index: 2, virtual_index: 2, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '4', index: 3, virtual_index: 3, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '5', index: 4, virtual_index: 4, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '6', index: 5, virtual_index: 5, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '7', index: 6, virtual_index: 6, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionFinished }
    ];


    const getMessages = jest.fn((executionId: string, fromVirtualIndex:number, toVirtualIndex: number) => {
      // Here we mock that the database is not returning the expected number of messages
      return Observable.of([msgs[2], msgs[3]].map(toSnapshot));
    });

    const bulkUpdate = jest.fn().mockReturnValue(Observable.of({}));

    let mockRepository = { getMessages, bulkUpdate };

    let recycleService = new RecycleService({
      messageRepository: mockRepository,
      getMessageTimeout: 1000,
      bulkUpdateTimeout: 1000,
      triggerIndex: 5,
      triggerIndexStep: 1,
      tailLength: 3,
      deleteCount: 2
    });

    let outboundMsgs: Array<ExecutionMessage> = [];

    return Observable
      .from(msgs)
      .let(msgs => recycleService.watch('1', msgs))
      .do(val => outboundMsgs.push(val))
      .toPromise()
      .then(() => {
        
        expect(outboundMsgs[0].index).toBe(0);
        expect(outboundMsgs[0].virtual_index).toBe(0);

        expect(outboundMsgs[1].index).toBe(1);
        expect(outboundMsgs[1].virtual_index).toBe(1);

        expect(outboundMsgs[2].index).toBe(2);
        expect(outboundMsgs[2].virtual_index).toBe(2);

        expect(outboundMsgs[3].index).toBe(3);
        expect(outboundMsgs[3].virtual_index).toBe(3);

        expect(outboundMsgs[4].index).toBe(4);
        expect(outboundMsgs[4].virtual_index).toBe(4);

        expect(outboundMsgs[5].index).toBe(5);
        expect(outboundMsgs[5].virtual_index).toBe(5);

        expect(outboundMsgs[6].index).toBe(6);
        expect(outboundMsgs[6].virtual_index).toBe(6);

        // There should be no update because recycling was skipped
        expect(mockRepository.bulkUpdate.mock.calls.length).toBe(0);
        // We tried it a second time because of the increasing trigger index
        expect(mockRepository.getMessages.mock.calls.length).toBe(2);
      });
  });


  it('should leave index untouched and retry later if bulk update fails', () => {

    let msgs: Array<any> = [
      { id: '1', index: 0, virtual_index: 0, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionStarted },
      { id: '2', index: 1, virtual_index: 1, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '3', index: 2, virtual_index: 2, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '4', index: 3, virtual_index: 3, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '5', index: 4, virtual_index: 4, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '6', index: 5, virtual_index: 5, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      // It should retry at the following message
      { id: '7', index: 6, virtual_index: 6, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionFinished }
    ];

    const getMessages = jest.fn(createGetMessages(msgs));

    const bulkUpdate = jest.fn()
                            .mockReturnValueOnce(Observable.throw('no internet'))
                            .mockReturnValueOnce(Observable.of({}));

    let mockRepository = { getMessages, bulkUpdate };

    let recycleService = new RecycleService({
      messageRepository: mockRepository,
      getMessageTimeout: 1000,
      bulkUpdateTimeout: 1000,
      triggerIndex: 5,
      triggerIndexStep: 1,
      tailLength: 3,
      deleteCount: 2
    });

    let outboundMsgs: Array<ExecutionMessage> = [];

    return Observable
      .from(msgs)
      .let(msgs => recycleService.watch('1', msgs))
      .do(val => outboundMsgs.push(val))
      .toPromise()
      .then(() => {

        expect(outboundMsgs[0].index).toBe(0);
        expect(outboundMsgs[0].virtual_index).toBe(0);

        expect(outboundMsgs[1].index).toBe(1);
        expect(outboundMsgs[1].virtual_index).toBe(1);

        expect(outboundMsgs[2].index).toBe(2);
        expect(outboundMsgs[2].virtual_index).toBe(2);

        expect(outboundMsgs[3].index).toBe(3);
        expect(outboundMsgs[3].virtual_index).toBe(3);

        expect(outboundMsgs[4].index).toBe(4);
        expect(outboundMsgs[4].virtual_index).toBe(4);

        expect(outboundMsgs[5].index).toBe(5);
        expect(outboundMsgs[5].virtual_index).toBe(5);

        //This is the message that triggered the recycle at the second attempt
        expect(outboundMsgs[6].index).toBe(4);
        expect(outboundMsgs[6].virtual_index).toBe(6);

        // Second call because first call fails
        expect(mockRepository.bulkUpdate.mock.calls.length).toBe(2);

        // That's the one that failed
        expect(mockRepository.bulkUpdate.mock.calls[0])
        .toEqual([{
          '/executions/1/messages/3': null,
          '/executions/1/messages/4': null,
          '/executions/1/messages/5/index': 2
        }]);

        // That's the second call that worked
        expect(mockRepository.bulkUpdate.mock.calls[1])
        .toEqual([{
          '/executions/1/messages/4': null,
          '/executions/1/messages/5': null,
          '/executions/1/messages/6/index': 3
        }]);

      });
  });

  it('should leave index untouched but retry later if bulkUpdate times out', () => {

    let msgs: Array<any> = [
      { id: '1', index: 0, virtual_index: 0, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionStarted },
      { id: '2', index: 1, virtual_index: 1, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '3', index: 2, virtual_index: 2, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '4', index: 3, virtual_index: 3, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '5', index: 4, virtual_index: 4, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '6', index: 5, virtual_index: 5, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '7', index: 6, virtual_index: 6, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionFinished }
    ];


    const getMessages = jest.fn(createGetMessages(msgs));

    const bulkUpdate = jest.fn()
                            .mockReturnValueOnce(Observable.of({}).delay(1500))
                            .mockReturnValueOnce(Observable.of({}));


    let mockRepository = { getMessages, bulkUpdate };

    let recycleService = new RecycleService({
      messageRepository: mockRepository,
      getMessageTimeout: 1000,
      bulkUpdateTimeout: 1000,
      triggerIndex: 5,
      triggerIndexStep: 1,
      tailLength: 3,
      deleteCount: 2
    });

    let outboundMsgs: Array<ExecutionMessage> = [];

    return Observable
      .from(msgs)
      .let(msgs => recycleService.watch('1', msgs))
      .do(val => outboundMsgs.push(val))
      .toPromise()
      .then(() => {

        expect(outboundMsgs[0].index).toBe(0);
        expect(outboundMsgs[0].virtual_index).toBe(0);

        expect(outboundMsgs[1].index).toBe(1);
        expect(outboundMsgs[1].virtual_index).toBe(1);

        expect(outboundMsgs[2].index).toBe(2);
        expect(outboundMsgs[2].virtual_index).toBe(2);

        expect(outboundMsgs[3].index).toBe(3);
        expect(outboundMsgs[3].virtual_index).toBe(3);

        expect(outboundMsgs[4].index).toBe(4);
        expect(outboundMsgs[4].virtual_index).toBe(4);

        expect(outboundMsgs[5].index).toBe(5);
        expect(outboundMsgs[5].virtual_index).toBe(5);

        expect(outboundMsgs[6].index).toBe(4);
        expect(outboundMsgs[6].virtual_index).toBe(6);

        // two attempts, first times out
        expect(mockRepository.bulkUpdate.mock.calls.length).toBe(2);

        // That's the one that failed
        expect(mockRepository.bulkUpdate.mock.calls[0])
        .toEqual([{
          '/executions/1/messages/3': null,
          '/executions/1/messages/4': null,
          '/executions/1/messages/5/index': 2
        }]);

        // That's the second call that worked
        expect(mockRepository.bulkUpdate.mock.calls[1])
        .toEqual([{
          '/executions/1/messages/4': null,
          '/executions/1/messages/5': null,
          '/executions/1/messages/6/index': 3
        }]);
      });
  });


  it('should leave index untouched but retry later if getMessages fails', () => {

    let msgs: Array<any> = [
      { id: '1', index: 0, virtual_index: 0, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionStarted },
      { id: '2', index: 1, virtual_index: 1, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '3', index: 2, virtual_index: 2, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '4', index: 3, virtual_index: 3, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '5', index: 4, virtual_index: 4, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '6', index: 5, virtual_index: 5, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '7', index: 6, virtual_index: 6, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionFinished }
    ];


    //First call fails, second works
    const getMessages = jest.fn(createGetMessages(msgs))
                            .mockImplementationOnce(() => Observable.throw('no internet'));

    const bulkUpdate = jest.fn().mockReturnValue(Observable.of({}));

    let mockRepository = { getMessages, bulkUpdate };

    let recycleService = new RecycleService({
      messageRepository: mockRepository,
      getMessageTimeout: 1000,
      bulkUpdateTimeout: 1000,
      triggerIndex: 5,
      triggerIndexStep: 1,
      tailLength: 3,
      deleteCount: 2
    });

    let outboundMsgs: Array<ExecutionMessage> = [];

    return Observable
      .from(msgs)
      .let(msgs => recycleService.watch('1', msgs))
      .do(val => outboundMsgs.push(val))
      .toPromise()
      .then(() => {

        expect(outboundMsgs[0].index).toBe(0);
        expect(outboundMsgs[0].virtual_index).toBe(0);

        expect(outboundMsgs[1].index).toBe(1);
        expect(outboundMsgs[1].virtual_index).toBe(1);

        expect(outboundMsgs[2].index).toBe(2);
        expect(outboundMsgs[2].virtual_index).toBe(2);

        expect(outboundMsgs[3].index).toBe(3);
        expect(outboundMsgs[3].virtual_index).toBe(3);

        expect(outboundMsgs[4].index).toBe(4);
        expect(outboundMsgs[4].virtual_index).toBe(4);

        expect(outboundMsgs[5].index).toBe(5);
        expect(outboundMsgs[5].virtual_index).toBe(5);

        expect(outboundMsgs[6].index).toBe(4);
        expect(outboundMsgs[6].virtual_index).toBe(6);

        // Only one call for the second attempt
        expect(mockRepository.bulkUpdate.mock.calls.length).toBe(1);

        expect(mockRepository.bulkUpdate.mock.calls[0])
        .toEqual([{
          '/executions/1/messages/4': null,
          '/executions/1/messages/5': null,
          '/executions/1/messages/6/index': 3
        }]);
      });
  });

  it('should leave index untouched but retry later if getMessages times out', () => {

    let msgs: Array<any> = [
      { id: '1', index: 0, virtual_index: 0, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionStarted },
      { id: '2', index: 1, virtual_index: 1, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '3', index: 2, virtual_index: 2, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '4', index: 3, virtual_index: 3, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '5', index: 4, virtual_index: 4, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '6', index: 5, virtual_index: 5, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
      { id: '7', index: 6, virtual_index: 6, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionFinished }
    ];


    //First call fails, second works
    const getMessages = jest.fn(createGetMessages(msgs))
                            .mockImplementationOnce(() => Observable.of().delay(1500));

    const bulkUpdate = jest.fn().mockReturnValue(Observable.of({}));

    let mockRepository = { getMessages, bulkUpdate };

    let recycleService = new RecycleService({
      messageRepository: mockRepository,
      getMessageTimeout: 1000,
      bulkUpdateTimeout: 1000,
      triggerIndex: 5,
      triggerIndexStep: 1,
      tailLength: 3,
      deleteCount: 2
    });

    let outboundMsgs: Array<ExecutionMessage> = [];

    return Observable
      .from(msgs)
      .let(msgs => recycleService.watch('1', msgs))
      .do(val => outboundMsgs.push(val))
      .toPromise()
      .then(() => {

        expect(outboundMsgs[0].index).toBe(0);
        expect(outboundMsgs[0].virtual_index).toBe(0);

        expect(outboundMsgs[1].index).toBe(1);
        expect(outboundMsgs[1].virtual_index).toBe(1);

        expect(outboundMsgs[2].index).toBe(2);
        expect(outboundMsgs[2].virtual_index).toBe(2);

        expect(outboundMsgs[3].index).toBe(3);
        expect(outboundMsgs[3].virtual_index).toBe(3);

        expect(outboundMsgs[4].index).toBe(4);
        expect(outboundMsgs[4].virtual_index).toBe(4);

        expect(outboundMsgs[5].index).toBe(5);
        expect(outboundMsgs[5].virtual_index).toBe(5);

        expect(outboundMsgs[6].index).toBe(4);
        expect(outboundMsgs[6].virtual_index).toBe(6);

        // Only one call for the second attempt
        expect(mockRepository.bulkUpdate.mock.calls.length).toBe(1);

        expect(mockRepository.bulkUpdate.mock.calls[0])
        .toEqual([{
          '/executions/1/messages/4': null,
          '/executions/1/messages/5': null,
          '/executions/1/messages/6/index': 3
        }]);
      });
  });

  it('should queue up messages during recycle phase', () => {

        let msgs: Array<any> = [
          { id: '1', index: 0, virtual_index: 0, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionStarted },
          { id: '2', index: 1, virtual_index: 1, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
          { id: '3', index: 2, virtual_index: 2, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
          { id: '4', index: 3, virtual_index: 3, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
          { id: '5', index: 4, virtual_index: 4, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
          { id: '6', index: 5, virtual_index: 5, data: '', timestamp: Date.now(), kind: MessageKind.Stdout },
          { id: '7', index: 6, virtual_index: 6, data: '', timestamp: Date.now(), kind: MessageKind.ExecutionFinished }
        ];

        //Getting the messages takes half a second. This is expected to make
        //messages index > 5 queue up.
        let getMessageDelay = 500;
        const getMessages = jest.fn(createGetMessages(msgs, getMessageDelay));

        let bulkUpdateDelay = 500;
        // The bulk update takes another half second to execute. We are expecting all messages
        // index > 5 to queue up for a total of 1 seconds
        const bulkUpdate = jest.fn().mockReturnValue(Observable.of({}).delay(bulkUpdateDelay));

        let mockRepository = { getMessages, bulkUpdate };

        let recycleService = new RecycleService({
          messageRepository: mockRepository,
          getMessageTimeout: 1000,
          bulkUpdateTimeout: 1000,
          triggerIndex: 5,
          triggerIndexStep: 1,
          tailLength: 3,
          deleteCount: 2
        });

        let outboundMsgs: Array<ExecutionMessage> = [];

        return Observable
          .from(msgs)
          .let(msgs => recycleService.watch('1', msgs))
          .do(val => {
            // We are getting a timestamp at the moment where the messages
            // come out of the recycleService. Therefore we can compare if
            // messages actually come out defered.
            val['received_at'] = Date.now();
            outboundMsgs.push(val);
          })
          .toPromise()
          .then(() => {
            expect(outboundMsgs[0].index).toBe(0);
            expect(outboundMsgs[0].virtual_index).toBe(0);

            expect(outboundMsgs[1].index).toBe(1);
            expect(outboundMsgs[1].virtual_index).toBe(1);

            expect(outboundMsgs[2].index).toBe(2);
            expect(outboundMsgs[2].virtual_index).toBe(2);

            expect(outboundMsgs[3].index).toBe(3);
            expect(outboundMsgs[3].virtual_index).toBe(3);

            expect(outboundMsgs[4].index).toBe(4);
            expect(outboundMsgs[4].virtual_index).toBe(4);

            let preRecycleReceivedAt = outboundMsgs[4]['received_at'];
            let expectedDelay = getMessageDelay + bulkUpdateDelay;
            expect(outboundMsgs[5]['received_at'] - preRecycleReceivedAt).toBeGreaterThanOrEqual(expectedDelay)
            expect(outboundMsgs[5].index).toBe(3);
            expect(outboundMsgs[5].virtual_index).toBe(5);

            expect(outboundMsgs[6]['received_at'] - preRecycleReceivedAt).toBeGreaterThanOrEqual(expectedDelay)
            expect(outboundMsgs[6].index).toBe(4);
            expect(outboundMsgs[6].virtual_index).toBe(6);

            expect(mockRepository.bulkUpdate.mock.calls.length).toBe(1);

            expect(mockRepository.bulkUpdate.mock.calls[0])
            .toEqual([{
              '/executions/1/messages/3': null,
              '/executions/1/messages/4': null,
              '/executions/1/messages/5/index': 2
            }]);
          });
      });

});
