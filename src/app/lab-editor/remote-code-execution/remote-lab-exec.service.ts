import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Lab } from '../../models/lab';
import { Invocation, InvocationType } from '../../models/invocation';
import { Execution, ExecutionStatus, ExecutionMessage, MessageKind, ExecutionWrapper } from '../../models/execution';
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

  run(lab: Lab): Observable<ExecutionWrapper> {
    let id = this.newInvocationId();
    let executionWrapper$ = this.authService
      .requireAuthOnce()
      .switchMap(login => this.db.invocationRef(id).set({
        id: id,
        user_id: login.uid,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        type: InvocationType.StartExecution,
        data: {
          id: lab.id,
          directory: lab.directory
        }
      }))
      .switchMap(_ => this.listen(id));

    return executionWrapper$;
  }

  listen(executionId: string): Observable<ExecutionWrapper> {
    let messages$ = this.db.executionMessageRef(executionId)
                               .childAdded()
                               .map(snapshot => snapshot.val());

    let execution$ = this.db.executionRef(executionId)
                            .value()
                            .map(snapshot => snapshot.val());

    return this.consumeExecution(messages$, execution$);
  }

  consumeExecution(messages: Observable<ExecutionMessage>, execution: Observable<Execution>): Observable<ExecutionWrapper> {

    let sharedMessages = messages.share();
    let sharedExecution = execution.share();

    let messagesNotFinishedOrRejected = (msg: ExecutionMessage) =>
                      msg.kind !== MessageKind.ExecutionFinished &&
                      msg.kind !== MessageKind.ExecutionRejected;

    let executingExecutions = (exec: Execution) => exec.status === ExecutionStatus.Executing;

    let messages$ = sharedMessages.takeWhileInclusive(messagesNotFinishedOrRejected);

    let rejectedMessage = sharedMessages.filter(msg => msg.kind === MessageKind.ExecutionRejected);

    let execution$ = sharedExecution
                      .filter(exec => !!exec)
                      .takeWhileInclusive(executingExecutions)
                      .takeUntil(rejectedMessage);

    return Observable.of({
      messages: messages$,
      execution: execution$
    });
  }

  stop(executionId: string) {

    let id = this.newInvocationId();

    return this.authService
      .requireAuthOnce()
      .switchMap(login => this.db.invocationRef(id).set({
        id: id,
        type: InvocationType.StopExecution,
        data: { execution_id: executionId },
        user_id: login.uid,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })).subscribe();
  }

  private newInvocationId() {
    return `${Date.now()}-${shortid.generate()}`;
  }
}
