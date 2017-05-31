import { TestBed } from '@angular/core/testing';
import { Inject } from '@angular/core';
import { DoneWhen } from '../../../test-helper/doneWhen';
import { Observable } from 'rxjs/Observable';

import { RemoteLabExecService } from './remote-lab-exec.service';
import { AuthService } from '../../auth';
import { DATABASE } from '../../app.tokens';
import { DbRefBuilder } from '../../firebase/db-ref-builder';
import { LabExecutionContext, Lab } from '../../models/lab';
import { MessageKind, ExecutionStatus } from '../../models/execution';


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


  context = new LabExecutionContext();

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
      let doneWhen = new DoneWhen(done).calledNTimes(2);

      let messages$ = new Observable(obs => {
          obs.next(createMessageSnapshot(MessageKind.Stdout, 'some-text'));
          obs.next(createMessageSnapshot(MessageKind.Stdout, 'other-text'));
          obs.next(createMessageSnapshot(MessageKind.ExecutionFinished, ''));
          obs.next(createMessageSnapshot(MessageKind.Stdout, 'other-text'));
          return () => {
            // in case the cleanup does not run, the test won't complete
            // which seems to be the only way to properly test this.
            doneWhen.call();
          };
      });

      // FIXME This is really fragile. If we return undefined the test throws but passes
      spyOn(rleService, 'executionMessagesAsObservable')
        .and.callFake((id) => {
          if (id === context.id) {
            return messages$;
          }
        });

      spyOnExecutionAndCallDone(db, doneWhen);

      let actualMessages = [];
      rleService.run(context, testLab)
                .do(data => actualMessages.push(data))
                .finally(() => {
                  expect(actualMessages).toEqual([
                    { kind: 0, data: 'some-text' },
                    { kind: 0, data: 'other-text' },
                    { kind: 3, data: '' }
                  ]);
                })
                .subscribe();

    });

    it('should handle ExecutionRejected gracefully', (done) => {
      let doneWhen = new DoneWhen(done).calledNTimes(2);

      let messages$ = new Observable(obs => {
          obs.next(createMessageSnapshot(MessageKind.ExecutionRejected, 'not allowed'));
          return () => {
            // in case the cleanup does not run, the test won't complete
            // which seems to be the only way to properly test this.
            doneWhen.call();
          };
      });

      // FIXME This is really fragile. If we return undefined the test throws but passes
      spyOn(rleService, 'executionMessagesAsObservable')
        .and.callFake((id) => {
          if (id === context.id) {
            return messages$;
          }
        });

      spyOnExecutionAndCallDone(db, doneWhen);

      let actualMessages = [];
      rleService.run(context, testLab)
                .do(data => actualMessages.push(data))
                .finally(() => {
                  expect(actualMessages).toEqual([
                    { kind: 5, data: 'not allowed' }
                  ]);
                })
                .subscribe();

    });

    it('should handle OutputRedirected gracefully', (done) => {

      let doneWhen = new DoneWhen(done).calledNTimes(3);

      let messages$ = new Observable(obs => {
          obs.next(createMessageSnapshot(MessageKind.OutputRedirected, '2'));
          return () => {
            // in case the cleanup does not run, the test won't complete
            // which seems to be the only way to properly test this.
            doneWhen.call();
          };
      });

      let redirectedMessages$ = new Observable(obs => {
          setTimeout(() => {
            obs.next(createMessageSnapshot(MessageKind.Stdout, 'some-text'));
            obs.next(createMessageSnapshot(MessageKind.Stdout, 'other-text'));
          }, 100);

          setTimeout(() => {
            obs.next(createMessageSnapshot(MessageKind.ExecutionFinished, ''));
            obs.next(createMessageSnapshot(MessageKind.Stdout, 'other-text'));
          }, 200);

          return () => {
            // in case the cleanup does not run, the test won't complete
            // which seems to be the only way to properly test this.
            doneWhen.call();
          };
      });

      // FIXME This is really fragile. If we return undefined the test throws but passes
      spyOn(rleService, 'executionMessagesAsObservable')
        .and.callFake((id) => {
          if (id === context.id) {
            return messages$;
          } else if (id === '2') {
            return redirectedMessages$;
          }
        });

      spyOnExecutionAndCallDone(db, doneWhen);

      let actualMessages = [];
      rleService.run(context, testLab)
                .do(data => actualMessages.push(data))
                .finally(() => {
                  expect(actualMessages).toEqual([
                    { kind: 4, data: '2' },
                    { kind: 1, data: 'This is a cached execution. You are looking at a truncated response.' },
                    { kind: 0, data: 'some-text' },
                    { kind: 0, data: 'other-text' },
                    { kind: 3, data: '' }
                  ]);
                })
                .subscribe();

      doneWhen.assertBeforeDone(() => {
        expect(context.execution.redirected).toBeTruthy();
      });

    });

  });
});
