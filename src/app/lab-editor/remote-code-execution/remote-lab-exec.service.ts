import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Lab, LabExecutionContext } from '../../models/lab';
import { Invocation, InvocationType } from '../../models/invocation';
import { Execution, ExecutionStatus, ExecutionMessage, MessageKind } from '../../models/execution';
import { ContextExecutionUpdater } from './context-execution-updater';
import * as shortid from 'shortid';
import * as firebase from 'firebase';

import { DbRefBuilder } from '../../firebase/db-ref-builder';
import { AuthService } from '../../auth';

@Injectable()
export class RemoteLabExecService {

  MAX_CACHE_MESSAGES = 5000;

  constructor(private db: DbRefBuilder, private authService: AuthService) {
  }

  private executionMessagesAsObservable(id: string, limitToLast = 0) {
    return this.db.executionMessageRef(id, limitToLast).childAdded();
  }


  /**
   * Executes code on the server. Returns an Observable<string>
   * where `string` is each line that was printed to STDOUT.
   */
  run (context: LabExecutionContext, lab: Lab): Observable<ExecutionMessage> {

    // This shouldn't really happen in practice because the UI forbids this.
    // But semantically it makes sense to check for it.
    if (context.execution.status === ExecutionStatus.Executing) {
      this.stop(context.clone());
    }

    let id = `${Date.now()}-${shortid.generate()}`;
    context.setData(lab, id);

    let contextUpdater = new ContextExecutionUpdater(this.db, context);
    let output$ = this.authService
                    .requireAuthOnce()
                    .switchMap(login => this.db.invocationRef(context.id).set({
                        id: context.id,
                        user_id: login.uid,
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                        type: InvocationType.StartExecution,
                        data: {
                          id: context.lab.id,
                          files: context.lab.files
                        }
                    }))
                    .switchMap(_ => this.executionMessagesAsObservable(context.id))
                    .map((snapshot: any) => snapshot.val())
                    .share();

    // if the first message isn't a redirect, set this execution on the context
    output$.take(1)
           .filter(msg => msg.kind !== MessageKind.OutputRedirected)
           .subscribe(_ => contextUpdater.executionId = id);

    // we create a stream that - based on a filter - will only ever start producing
    // messages if the output was redirected
    let redirectedOutput$ = output$.filter(msg => msg.kind === MessageKind.OutputRedirected)
                                   .do(msg => {
                                     contextUpdater.executionId = msg.data;
                                     context.execution.redirected = true;
                                    })
                                   .switchMap(msg => this.executionMessagesAsObservable(msg.data, this.MAX_CACHE_MESSAGES)
                                                         .map((snapshot: any) => snapshot.val())
                                                         .merge(Observable.of({
                                                              kind: MessageKind.Stderr,
                                                              data: `This is a cached execution. You are looking at a truncated response.`
                                                            })));


    // we combine the regular stream with the redirected one (which may never be used)
    let outputWithRedirects$ = output$
            .merge(redirectedOutput$)
            .takeWhileInclusive(msg => msg.kind !== MessageKind.ExecutionFinished && msg.kind !== MessageKind.ExecutionRejected)
            .share();

    contextUpdater.output = outputWithRedirects$;

    return outputWithRedirects$;
  }

  stop(context: LabExecutionContext) {
    context.execution.status = ExecutionStatus.Stopped;
    return this.authService
      .requireAuthOnce()
      .switchMap(_ => this.db.invocationRef(context.id).onceValue())
      .map((snapshot: any) => snapshot.val())
      .switchMap(data => this.db.invocationRef(context.id).update({type: InvocationType.StopExecution}))
      .subscribe();
  }
}
