import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Lab } from '../../models/lab';
import { Invocation, InvocationType } from '../../models/invocation';
import {
  Execution,
  ExecutionStatus,
  ExecutionMessage,
  MessageKind,
  ExecutionWrapper,
  ExecutionInvocationInfo
} from '../../models/execution';
import { MessageStreamOptimizer } from './message-stream-optimizer';

import * as shortid from 'shortid';
import * as firebase from 'firebase';

import { DbRefBuilder } from '../../firebase/db-ref-builder';
import { AuthService } from '../../auth';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeUntil';
import '../../rx/takeWhileInclusive';

@Injectable()
export class RemoteLabExecService {

  PARTITION_SIZE = 100;
  FULL_FETCH_TRESHOLD = 500;

  messageStreamOptimizer: MessageStreamOptimizer;

  constructor(private db: DbRefBuilder, private authService: AuthService) {
    this.messageStreamOptimizer = new MessageStreamOptimizer(db, this.PARTITION_SIZE, this.FULL_FETCH_TRESHOLD);
  }

  run(lab: Lab): Observable<ExecutionInvocationInfo> {
    let id = this.newInvocationId();
    return this.authService
      .requireAuthOnce()
      // Unfortunately we can't batch this. The request that sets the
      // RateProof must come first.
      .switchMap(login => this.db.userInvocationRateProofRef(login.uid).set({
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        key: id
      }).map(_ => login))
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
      .switchMap(_ =>  this.db.executionMessageRef(id).limitToFirst(1).childAdded().take(1))
      .map(snapshot => snapshot.val())
      .switchMap(message => {
        // If the execution was rejected, there's no point to try to fetch it
        // hence we directly return the ExecutionInvocationInfo which ends the whole stream
        if (message.kind === MessageKind.ExecutionRejected) {
          return Observable.of({
            executionId: id,
            rejection: message.data,
            persistent: false
          });
        } else {
          // As we start listening for the execution before it may be written, we have
          // to continue to listen until it is not null anymore. We do want the first non-null
          // value to get propagated, hence the takeWhileInclusive.
          // Theoretically we could map the null value to an ExecutionInvocationInfo that
          // has `persistent` set to `false` but that would match exactly the same message
          // that gets propagated synchronously in the beginning which means it doesn't add any
          // value, hence we filter it out.
          return this.db.executionRef(id)
                 .value()
                 .map(s => s.val())
                 .takeWhileInclusive(e => e === null)
                 .filter(e => e !== null)
                 .map(_ => ({ persistent: true, executionId: id, rejection: null}));
        }
      })
      .startWith({
        executionId: id,
        persistent: false,
        rejection: null
      })
      .catch((e) => {
        console.error('Rate limit exceeded.');
        return Observable.throw({
          executionId: id,
          error: e
        });
      })
  }

  runAndListen(lab: Lab): Observable<ExecutionWrapper> {
    return this.run(lab)
               .map(info => this.listen(info.executionId));
  }

  listen(executionId: string): ExecutionWrapper {

    let execution$ = this.db.executionRef(executionId)
                            .value()
                            .map(snapshot => snapshot.val());

    let messages$ = this.messageStreamOptimizer.listenForMessages(executionId);

    return this.consumeExecution(messages$, execution$);
  }

  consumeExecution(messages: Observable<ExecutionMessage>, execution: Observable<Execution>): ExecutionWrapper {

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

    return {
      messages: messages$,
      execution: execution$
    };
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
