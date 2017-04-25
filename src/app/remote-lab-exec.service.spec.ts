import { TestBed } from '@angular/core/testing';
import { Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RemoteLabExecService } from './remote-lab-exec.service';
import { AuthService } from './auth';
import { DATABASE } from './app.tokens';
import { DbRefBuilder } from './firebase/db-ref-builder';
import { LabExecutionContext, Lab } from './models/lab';
import { MessageKind } from 'app/models/execution-message';

let testLab = {
  id: '1',
  user_id: 'user id',
  name: 'Existing lab',
  description: '',
  tags: ['existing'],
  files: [],
  has_cached_run: false
};

let context = new LabExecutionContext();

let authServiceStub = {
  requireAuthOnce: () => {}
};

let databaseStub = {
  ref: (arg) => {
    return {
      once: (_arg) => {},
      set: (_arg) => Promise.resolve(_arg)
    };
  }
};

let createSnapshot = (kind, data) => ({ val: () => ({kind: kind, data: data})});

describe('RemoteLabExecService', () => {

  let authService: AuthService;
  let db;
  let rleService: RemoteLabExecService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RemoteLabExecService,
        { provide: AuthService, useValue: authServiceStub },
        { provide: DATABASE, useValue: databaseStub },
        DbRefBuilder
      ]
    });

    authService = TestBed.get(AuthService);
    db = TestBed.get(DATABASE);
    rleService = TestBed.get(RemoteLabExecService);

    let user = { uid: 'some-id' };

    spyOn(authService, 'requireAuthOnce').and.returnValue(Observable.of(user));
  });

  describe('.run()', () => {

    it('should handle ProcessFinished gracefully', (done) => {

      let messages$ = new Observable(obs => {
          obs.next(createSnapshot(MessageKind.Stdout, 'some-text'));
          obs.next(createSnapshot(MessageKind.Stdout, 'other-text'));
          obs.next(createSnapshot(MessageKind.ExecutionFinished, ''));
          obs.next(createSnapshot(MessageKind.Stdout, 'other-text'));
          return () => {
            // in case the cleanup does not run, the test won't complete
            // which seems to be the only way to properly test this.
            done();
          };
      });

      // FIXME This is really fragile. If we return undefined the test throws but passes
      spyOn(rleService, 'executionMessagesAsObservable')
        .and.callFake((id) => {
          if (id === context.id) {
            return messages$;
          }
        });

      let actualMessages = [];
      rleService.run(context, testLab)
                .do(data => actualMessages.push(data))
                .finally(() => {
                  expect(actualMessages).toEqual([
                    { kind: 0, data: 'some-text' },
                    { kind: 0, data: 'other-text' },
                    { kind: 2, data: '' }
                  ]);
                })
                .subscribe();

    });

    it('should handle ExecutionRejected gracefully', (done) => {

      let messages$ = new Observable(obs => {
          obs.next(createSnapshot(MessageKind.ExecutionRejected, 'not allowed'));
          return () => {
            // in case the cleanup does not run, the test won't complete
            // which seems to be the only way to properly test this.
            done();
          };
      });

      // FIXME This is really fragile. If we return undefined the test throws but passes
      spyOn(rleService, 'executionMessagesAsObservable')
        .and.callFake((id) => {
          if (id === context.id) {
            return messages$;
          }
        });

      let actualMessages = [];
      rleService.run(context, testLab)
                .do(data => actualMessages.push(data))
                .finally(() => {
                  expect(actualMessages).toEqual([
                    { kind: 4, data: 'not allowed' }
                  ]);
                })
                .subscribe();

    });

    it('should handle OutputRedirected gracefully', (done) => {

      let doneCount = 0;
      let expectedDone = 2;
      let callDone = () => doneCount === expectedDone - 1 ? done() : doneCount++;

      let messages$ = new Observable(obs => {
          obs.next(createSnapshot(MessageKind.OutputRedirected, '2'));
          return () => {
            // in case the cleanup does not run, the test won't complete
            // which seems to be the only way to properly test this.
            callDone();
          };
      });

      let redirectedMessages$ = new Observable(obs => {
          obs.next(createSnapshot(MessageKind.Stdout, 'some-text'));
          obs.next(createSnapshot(MessageKind.Stdout, 'other-text'));
          obs.next(createSnapshot(MessageKind.ExecutionFinished, ''));
          obs.next(createSnapshot(MessageKind.Stdout, 'other-text'));
          return () => {
            // in case the cleanup does not run, the test won't complete
            // which seems to be the only way to properly test this.
            callDone();
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

      let actualMessages = [];
      rleService.run(context, testLab)
                .do(data => actualMessages.push(data))
                .finally(() => {
                  expect(actualMessages).toEqual([
                    { kind: 3, data: '2' },
                    { kind: 0, data: 'some-text' },
                    { kind: 0, data: 'other-text' },
                    { kind: 2, data: '' }
                  ]);
                })
                .subscribe();

    });

  });
});
