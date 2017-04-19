import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Lab, ExecutionStatus, LabExecutionContext } from './models/lab';
import { Run, RunAction } from './models/run';
import { OutputMessage, OutputKind } from './models/output';
import * as shortid from 'shortid';
import * as firebase from 'firebase';

import { DbRefBuilder } from './firebase/db-ref-builder';
import { AuthService } from './auth';

@Injectable()
export class RemoteLabExecService {

  MAX_CACHE_MESSAGES = 5000;

  constructor(private db: DbRefBuilder, private authService: AuthService) {
  }

  private processMessagesAsObservable(id: string, limitToLast = 0) {
    return this.db.processMessageRef(id, limitToLast).childAdded();
  }


  /**
   * Executes code on the server. Returns an Observable<string>
   * where `string` is each line that was printed to STDOUT.
   */
  run (context: LabExecutionContext, lab: Lab): Observable<OutputMessage> {

    // This shouldn't really happen in practice because the UI forbids this.
    // But semantically it makes sense to check for it.
    if (context.status === ExecutionStatus.Running) {
      this.stop(context.clone());
    }

    let id = `${Date.now()}-${shortid.generate()}`;
    context.setData(lab, id);
    context.status = ExecutionStatus.Running;

    let output$ = this.authService
                    .requireAuthOnce()
                    .switchMap(login => this.db.runRef(context.id).set({
                        id: context.id,
                        user_id: login.uid,
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                        type: RunAction.Run,
                        lab: {
                          id: context.lab.id,
                          files: context.lab.files
                        }
                    }))
                    .switchMap(_ => this.processMessagesAsObservable(context.id))
                    .map((snapshot: any) => snapshot.val())
                    .share();

    // we create a stream that - based on a filter - will only ever start producing
    // messages if the output was redirected
    let redirectedOutput$ = output$.filter(msg => msg.kind === OutputKind.OutputRedirected)
                                   .switchMap(msg => this.processMessagesAsObservable(msg.data, this.MAX_CACHE_MESSAGES)
                                                         .map((snapshot: any) => snapshot.val())
                                                         .merge(Observable.of({
                                                              kind: OutputKind.Stderr,
                                                              data: `This is a cached run. You are looking at a truncated response.`
                                                            })));


    // we combine the regular stream with the redirected one (which may never be used)
    return output$
            .merge(redirectedOutput$)
            .takeWhileInclusive(msg => msg.kind !== OutputKind.ExecutionFinished && msg.kind !== OutputKind.ExecutionRejected)
            .finally(() => context.status = ExecutionStatus.Done);
  }

  stop(context: LabExecutionContext) {
    context.status = ExecutionStatus.Stopped;
    return this.authService
      .requireAuthOnce()
      .switchMap(_ => this.db.runRef(context.id).onceValue())
      .map((snapshot: any) => snapshot.val())
      .switchMap(data => this.db.runRef(context.id).set(Object.assign(data, { type: RunAction.Stop })))
      .subscribe();
  }
}
