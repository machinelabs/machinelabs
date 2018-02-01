import 'jest';

import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { delay, tap } from 'rxjs/operators';
import { RecycleAccumulator } from './recycle-accumulator';
import { ExecutionMessage } from '../../models/execution';
import { recycleCmdFactory } from './recycle-cmd-factory';
import { RecycleService, RecycleConfig } from './recycle.service';
import { MessageKind } from '@machinelabs/models';


let toSnapshot = (v: any) => ({ val: () => v});

const createGetMessages = (msgs: Array<ExecutionMessage>, ms = 0) => (executionId: string, fromVirtualIndex: number, toVirtualIndex: number) => {
  let msgs$ = of(msgs.filter(msg => msg.virtual_index >= fromVirtualIndex && msg.virtual_index <= toVirtualIndex)
                           .map(toSnapshot));

  return ms > 0 ? msgs$.pipe(delay(ms)) : msgs$;
};

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

    const bulkUpdate = jest.fn().mockReturnValue(of({}));

    let mockRepository = { getMessages, bulkUpdate };

    let outboundMsgs: Array<ExecutionMessage> = [];

    let recycleService = new RecycleService({
      messageRepository: mockRepository,
      getMessageTimeout: 1000,
      triggerIndex: 5,
      triggerIndexStep: 1,
      tailLength: 3,
      deleteCount: 2
    });

    return from(msgs)
      .pipe(
        msgs$ => recycleService.watch('1', msgs$),
        tap((val: ExecutionMessage) => outboundMsgs.push(val))
      )
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


    const getMessages = jest.fn((executionId: string, fromVirtualIndex: number, toVirtualIndex: number) => {
      // Here we mock that the database is not returning the expected number of messages
      return of([msgs[2], msgs[3]].map(toSnapshot));
    });

    const bulkUpdate = jest.fn().mockReturnValue(of({}));

    let mockRepository = { getMessages, bulkUpdate };

    let recycleService = new RecycleService({
      messageRepository: mockRepository,
      getMessageTimeout: 1000,
      triggerIndex: 5,
      triggerIndexStep: 1,
      tailLength: 3,
      deleteCount: 2
    });

    let outboundMsgs: Array<ExecutionMessage> = [];

    return from(msgs)
      .pipe(
        msgs$ => recycleService.watch('1', msgs$),
        tap((val: ExecutionMessage) => outboundMsgs.push(val))
      )
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

  it('should not wait on bulkUpdate to complete', () => {

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
                            .mockReturnValueOnce(of({}).pipe(delay(1500)));


    let mockRepository = { getMessages, bulkUpdate };

    let recycleService = new RecycleService({
      messageRepository: mockRepository,
      getMessageTimeout: 1000,
      triggerIndex: 5,
      triggerIndexStep: 1,
      tailLength: 3,
      deleteCount: 2
    });

    let outboundMsgs: Array<ExecutionMessage> = [];

    return from(msgs)
      .pipe(
        msgs$ => recycleService.watch('1', msgs$),
        tap((val: ExecutionMessage) => outboundMsgs.push(val))
      )
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

        expect(outboundMsgs[5].index).toBe(3);
        expect(outboundMsgs[5].virtual_index).toBe(5);

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


    // First call fails, second works
    const getMessages = jest.fn(createGetMessages(msgs))
                            .mockImplementationOnce(() => _throw('no internet'));

    const bulkUpdate = jest.fn().mockReturnValue(of({}));

    let mockRepository = { getMessages, bulkUpdate };

    let recycleService = new RecycleService({
      messageRepository: mockRepository,
      getMessageTimeout: 1000,
      triggerIndex: 5,
      triggerIndexStep: 1,
      tailLength: 3,
      deleteCount: 2
    });

    let outboundMsgs: Array<ExecutionMessage> = [];

    return from(msgs)
      .pipe(
        msgs$ => recycleService.watch('1', msgs$),
        tap((val: ExecutionMessage) => outboundMsgs.push(val))
      )
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


    // First call fails, second works
    const getMessages = jest.fn(createGetMessages(msgs))
                            .mockImplementationOnce(() => of().pipe(delay(1500)));

    const bulkUpdate = jest.fn().mockReturnValue(of({}));

    let mockRepository = { getMessages, bulkUpdate };

    let recycleService = new RecycleService({
      messageRepository: mockRepository,
      getMessageTimeout: 1000,
      triggerIndex: 5,
      triggerIndexStep: 1,
      tailLength: 3,
      deleteCount: 2
    });

    let outboundMsgs: Array<ExecutionMessage> = [];

    return from(msgs)
      .pipe(
        msgs$ => recycleService.watch('1', msgs$),
        tap((val: ExecutionMessage) => outboundMsgs.push(val))
      )
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

        // Getting the messages takes half a second. This is expected to make
        // messages index > 5 queue up.
        let getMessageDelay = 500;
        const getMessages = jest.fn(createGetMessages(msgs, getMessageDelay));

        let bulkUpdateDelay = 500;
        // The bulk update takes another half second to execute. But we aren't waiting on it
        // We are expecting outgoing messages to be delayed by a total of 500ms
        const bulkUpdate = jest.fn().mockReturnValue(of({}).pipe(delay(bulkUpdateDelay)));

        let mockRepository = { getMessages, bulkUpdate };

        let recycleService = new RecycleService({
          messageRepository: mockRepository,
          getMessageTimeout: 1000,
              triggerIndex: 5,
          triggerIndexStep: 1,
          tailLength: 3,
          deleteCount: 2
        });

        let outboundMsgs: Array<ExecutionMessage> = [];

        return from(msgs)
          .pipe(
            msgs$ => recycleService.watch('1', msgs$),
            tap((val: ExecutionMessage) => {
              // We are getting a timestamp at the moment where the messages
              // come out of the recycleService. Therefore we can compare if
              // messages actually come out defered.
              val['received_at'] = Date.now();
              outboundMsgs.push(val);
            })
          )
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
            expect(outboundMsgs[5]['received_at'] - preRecycleReceivedAt).toBeGreaterThanOrEqual(getMessageDelay);
            expect(outboundMsgs[5].index).toBe(3);
            expect(outboundMsgs[5].virtual_index).toBe(5);

            expect(outboundMsgs[6]['received_at'] - preRecycleReceivedAt).toBeGreaterThanOrEqual(getMessageDelay);
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
