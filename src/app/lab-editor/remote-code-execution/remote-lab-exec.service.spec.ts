import { TestBed } from '@angular/core/testing';
import { Inject } from '@angular/core';
import { DoneWhen } from '../../../test-helper/doneWhen';
import { Observable } from 'rxjs/Observable';

import { RemoteLabExecService } from './remote-lab-exec.service';
import { AuthService } from '../../auth';
import { DATABASE } from '../../app.tokens';
import { DbRefBuilder } from '../../firebase/db-ref-builder';
import { MessageKind, ExecutionStatus, ExecutionMessage, Execution } from '../../models/execution';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';

let createSnapshot = data => ({ val: () => data });
let createMessageSnapshot = (kind, data) => createSnapshot({kind, data});

let testLab, context, authServiceStub, user,
    databaseStub, obsDbRefStub, snapshotStub, execution;

// it's important to recreate the stubs for every test to not
// have one test cause side effects for another test
function createStubs () {
  testLab = {
    id: '1',
    user_id: 'user id',
    name: 'Existing lab',
    description: '',
    tags: ['existing'],
    directory: [],
    has_cached_run: false
  };

    user = { uid: 'some-id' };

  authServiceStub = {
    requireAuthOnce: () => {}
  };

  databaseStub = {
    ref: (arg) => {
      return {
        once: (_arg) => {},
        set: (_arg) => Promise.resolve(_arg),
        on: () => {}
      };
    }
  };

  obsDbRefStub = {
    value: () => {}
  };

  snapshotStub = {
    val: () => {}
  };
}

function spyOnExecutionAndCallDone(db, doneWhen) {
     let executionRef = {
      value: () => new Observable(obs => {
        setTimeout(() => obs.next(createSnapshot({ status: ExecutionStatus.Executing })), 50);
        setTimeout(() => obs.next(createSnapshot({ status: ExecutionStatus.Finished })), 150);
        return () => doneWhen.call();
      })
    };
    spyOn(db, 'executionRef').and.returnValue(executionRef);
}


describe('RemoteLabExecService', () => {

  let authService: AuthService;
  let db;
  let rleService: RemoteLabExecService;

  beforeEach(() => {

    createStubs();

    TestBed.configureTestingModule({
      providers: [
        RemoteLabExecService,
        { provide: AuthService, useValue: authServiceStub },
        { provide: DATABASE, useValue: databaseStub },
        DbRefBuilder
      ]
    });

    authService = TestBed.get(AuthService);
    db = TestBed.get(DbRefBuilder);
    rleService = TestBed.get(RemoteLabExecService);

    spyOn(authService, 'requireAuthOnce').and.returnValue(Observable.of(user));
  });

  describe('.run()', () => {
    it('should handle ProcessFinished gracefully', (done) => {
      let doneWhen = new DoneWhen(done).calledNTimes(4);

      let playedMessages = [
        { id: '0', kind: MessageKind.Stdout, data: 'some-text' },
        { id: '1', kind: MessageKind.Stdout, data: 'other-text' },
        { id: '2', kind: MessageKind.ExecutionFinished, data: '' },
        { id: '3', kind: MessageKind.Stdout, data: 'other text' }
      ] as Array<ExecutionMessage>;

      let messagesSubscriber = 0;

      let messages$ = new Observable<ExecutionMessage>(obs => {
          messagesSubscriber++;
          obs.next(playedMessages[0]);
          obs.next(playedMessages[1]);
          obs.next(playedMessages[2]);
          obs.next(playedMessages[3]);
          return () => {
            // in case the cleanup does not run, the test won't complete
            // which seems to be the only way to properly test this.
            doneWhen.call();
          };
      }).delay(1);

      let playedExecutions = [
        { id: '1', status: ExecutionStatus.Executing },
        { id: '1', status: ExecutionStatus.Finished },
        { id: '1', status: ExecutionStatus.Executing }
      ] as Array<Execution>;

      let executionsSubscriber = 0;

      let executions$ = new Observable<Execution>(obs => {
          executionsSubscriber++;
          obs.next(playedExecutions[0]);
          obs.next(playedExecutions[1]);
          obs.next(playedExecutions[2]);
          return () => {
            // in case the cleanup does not run, the test won't complete
            // which seems to be the only way to properly test this.
            doneWhen.call();
          };
      }).delay(1);

      let actualMessages = [];
      let actualExecutions = [];

      doneWhen.assertBeforeDone(() => {
        expect(messagesSubscriber).toBe(1);
        expect(executionsSubscriber).toBe(1);
      });

      const wrapper = rleService.consumeExecution('someid', messages$, executions$);

      wrapper.messages
              .do(msg => actualMessages.push(msg))
              .finally(() => {
                expect(actualMessages.length).toBe(3);
                doneWhen.call();
              })
              .subscribe();

      wrapper.execution
              .do(e => {
                console.log(e);
                actualExecutions.push(e);
              })
              .finally(() => {
                expect(actualExecutions.length).toBe(2);
                doneWhen.call();
              })
              .subscribe();
    });

    it('should handle ExecutionRejected gracefully', (done) => {
      let doneWhen = new DoneWhen(done).calledNTimes(4);

      let playedMessages = [
        { id: '0', kind: MessageKind.ExecutionRejected, data: 'meh' },
        { id: '1', kind: MessageKind.Stdout, data: 'other-text' }
      ] as Array<ExecutionMessage>;

      let messagesSubscriber = 0;

      let messages$ = new Observable<ExecutionMessage>(obs => {
          messagesSubscriber++;
          console.log('producing messages$');
          obs.next(playedMessages[0]);
          obs.next(playedMessages[1]);
          return () => {
            // in case the cleanup does not run, the test won't complete
            // which seems to be the only way to properly test this.
            console.log('unsubscribed messages$');
            doneWhen.call();
          };
      }).delay(1);

      let playedExecutions = [
        null
      ] as Array<Execution>;

      let executionsSubscriber = 0;

      let executions$ = new Observable<Execution>(obs => {
          console.log('producing executions$');
          executionsSubscriber++;
          obs.next(playedExecutions[0]);
          return () => {
            // in case the cleanup does not run, the test won't complete
            // which seems to be the only way to properly test this.
            console.log('unsubscribed executions$');
            doneWhen.call();
          };
      }).delay(1);

      let actualMessages = [];
      let actualExecutions = [];

      doneWhen.assertBeforeDone(() => {
        expect(messagesSubscriber).toBe(1);
        expect(executionsSubscriber).toBe(1);
      });

      const wrapper = rleService.consumeExecution('someid', messages$, executions$);

      wrapper.messages
              .do(msg => actualMessages.push(msg))
              .finally(() => {
                expect(actualMessages.length).toBe(1);
                console.log('messages$ completed');
                doneWhen.call();
              })
              .subscribe();

      wrapper.execution
              .do(e => {
                actualExecutions.push(e);
              })
              .finally(() => {
                expect(actualExecutions.length).toBe(0);
                console.log('execution$ completed');
                doneWhen.call();
              })
              .subscribe();
    });
  });
});
