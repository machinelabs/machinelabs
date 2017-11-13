import { TestBed } from '@angular/core/testing';
import { Inject } from '@angular/core';
import { DoneWhen } from '../../../test-helper/doneWhen';

import { Subject } from 'rxjs/Subject';
import { from as fromStatic } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { delay, tap, finalize, last, skip, take } from 'rxjs/operators';

import { DATABASE } from '../../app.tokens';
import { DbRefBuilder } from '../../firebase/db-ref-builder';
import { MessageStreamOptimizer } from './message-stream-optimizer';
import { createSkipText } from '../util/skip-helper';
import { MessageKind } from '@machinelabs/models';



let databaseStub;

// it's important to recreate the stubs for every test to not
// have one test cause side effects for another test
function createStubs () {

  databaseStub = {
    ref: (arg) => {
      return {
        once: (_arg) => {},
        set: (_arg) => Promise.resolve(_arg),
        on: () => {}
      };
    }
  };
}

describe('MessageStreamOptimizer', () => {

  let db;
  let messageStreamOptimizer: MessageStreamOptimizer;
  let partitionSize = 2;
  let fullFetchTreshold = 6;

  beforeEach(() => {

    createStubs();

    TestBed.configureTestingModule({
      providers: [
        { provide: DATABASE, useValue: databaseStub },
        DbRefBuilder
      ]
    });

    db = TestBed.get(DbRefBuilder);
    messageStreamOptimizer = new MessageStreamOptimizer(db, partitionSize, fullFetchTreshold);

  });

  describe('.listenForMessages()', () => {
    it('should fetch entire messages if message count is below treshold', () => {

      let availableMessages = [
          { kind: MessageKind.Stdout, data: 'some-text', index: 0 },
          { kind: MessageKind.Stdout, data: 'other-text', index: 1 },
          { kind: MessageKind.Stdout, data: 'other-text', index: 2 },
          { kind: MessageKind.Stdout, data: 'other-text', index: 3 },
          { kind: MessageKind.ExecutionFinished, data: '', index: 4 }
        ];

      let allMessages = fromStatic(availableMessages);

      spyOn(messageStreamOptimizer, 'getAllMessages').and.returnValue(allMessages);
      spyOn(messageStreamOptimizer, 'getTailMessage').and.returnValue(allMessages.pipe(last()));
      spyOn(messageStreamOptimizer, 'getHeadMessages');
      spyOn(messageStreamOptimizer, 'getTailMessages');
      spyOn(messageStreamOptimizer, 'getLiveMessages');

      let seenMessages = []
      messageStreamOptimizer.listenForMessages(1).pipe(
        tap(message => seenMessages.push(message)),
        finalize(() => {
          expect(availableMessages).toEqual(seenMessages);
          expect(messageStreamOptimizer.getTailMessage).toHaveBeenCalledTimes(1);
          expect(messageStreamOptimizer.getAllMessages).toHaveBeenCalledTimes(1);
          expect(messageStreamOptimizer.getHeadMessages).not.toHaveBeenCalled();
          expect(messageStreamOptimizer.getTailMessages).not.toHaveBeenCalled();
        })
      ).subscribe();
    });


    it('should fetch head, tail and live messages if message count is below treshold', (done) => {

      let doneWhen = new DoneWhen(done).calledNTimes(1);

      let availableMessages = [
          { kind: MessageKind.Stdout, data: 'some-text', index: 0 },
          { kind: MessageKind.Stdout, data: 'other-text', index: 1 },
          { kind: MessageKind.Stdout, data: 'other-text', index: 2 },
          { kind: MessageKind.Stdout, data: 'other-text', index: 3 },
          { kind: MessageKind.Stdout, data: 'other-text', index: 4 },
          { kind: MessageKind.Stdout, data: 'other-text', index: 5 },
          { kind: MessageKind.Stdout, data: 'other-text', index: 6 },
          { kind: MessageKind.Stdout, data: 'other-text', index: 7 },
          { kind: MessageKind.Stdout, data: 'other-text', index: 8 },
        ];

      let allMessages = fromStatic(availableMessages);

      // TODO: This isn't really simulating live messages since they aren't async.
      let liveMessages = of(
        { kind: MessageKind.Stdout, data: 'other-text', index: 9 },
        { kind: MessageKind.ExecutionFinished, data: '', index: 10 }
      ).pipe(delay(1000));

      spyOn(messageStreamOptimizer, 'getAllMessages').and.returnValue(allMessages);
      spyOn(messageStreamOptimizer, 'getTailMessage').and.returnValue(allMessages.pipe(last()));
      spyOn(messageStreamOptimizer, 'getHeadMessages').and.returnValue(allMessages.pipe(take(2)));
      spyOn(messageStreamOptimizer, 'getTailMessages').and.returnValue(allMessages.pipe(skip(8)));
      spyOn(messageStreamOptimizer, 'getLiveMessages').and.returnValue(liveMessages);

      let seenMessages = [];

      let expectedMessages = [
        { kind: MessageKind.Stdout, data: 'some-text', index: 0 },
        { kind: MessageKind.Stdout, data: 'other-text', index: 1 },
        { kind: MessageKind.Stdout, data: createSkipText(4) },
        { kind: MessageKind.Stdout, data: 'other-text', index: 8 },
        { kind: MessageKind.Stdout, data: 'other-text', index: 9 },
        { kind: MessageKind.ExecutionFinished, data: '', index: 10 }
      ];

      messageStreamOptimizer.listenForMessages(1).pipe(
        tap(message => seenMessages.push(message)),
        finalize(() => {
          expect(expectedMessages).toEqual(seenMessages);
          expect(messageStreamOptimizer.getTailMessage).toHaveBeenCalledTimes(1);
          expect(messageStreamOptimizer.getAllMessages).not.toHaveBeenCalled();
          expect(messageStreamOptimizer.getHeadMessages).toHaveBeenCalledTimes(1);
          expect(messageStreamOptimizer.getTailMessages).toHaveBeenCalledTimes(1);
          doneWhen.call();
        })
      ).subscribe();
    });
  });
});
