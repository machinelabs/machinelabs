import * as firebase from 'firebase';
import { Crypto } from '../util/crypto';
import { environment } from '../environments/environment';
import { db, dbRefBuilder } from '../ml-firebase/db';
import { CodeRunner } from '../code-runner/code-runner';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';
import { map, share, filter, mergeMap, switchMap, startWith, concat, tap, catchError } from 'rxjs/operators';
import { Invocation, InvocationType } from '@machinelabs/models';
import { Execution, ExecutionStatus, Server, MessageKind } from '@machinelabs/models';
import { ProcessStreamData, parseLabDirectory } from '@machinelabs/core';
import { ExecutionMessage, toMessageKind } from '../models/execution';
import { ValidationService } from '../validation/validation.service';
import { ValidationContext } from '../validation/validation-context';
import { LabConfigResolver } from '../validation/resolver/lab-config-resolver';
import { ExecutionResolver } from '../validation/resolver/execution-resolver';
import { RecycleService } from './recycling/recycle.service';

const MAX_MESSAGES_COUNT = 10000;

export class MessagingService {
  server: Server;

  constructor(
    private startValidationService: ValidationService,
    private stopValidationService: ValidationService,
    private recycleService: RecycleService,
    private codeRunner: CodeRunner
  ) {}

  init() {
    dbRefBuilder
      .serverRef(environment.serverId)
      .onceValue()
      .pipe(map(snapshot => snapshot.val()))
      .subscribe(server => {
        this.server = server;
        this.initMessaging();
      });
  }

  initMessaging() {
    // Share one subscription to all incoming messages
    const newInvocations$ = dbRefBuilder
      .newInvocationsForServerRef(this.server.id)
      .childAdded()
      .pipe(map(snapshot => snapshot.val().common), share());

    // Invoke new processes for incoming StartExecution Invocations
    newInvocations$
      .pipe(
        filter((invocation: Invocation) => invocation.type === InvocationType.StartExecution),
        map(invocation => {
          invocation.data.directory = parseLabDirectory(invocation.data.directory);
          return invocation;
        })
      )
      .subscribe((invocation: Invocation) => {
        this.getOutputAsObservable(invocation)
          .pipe(mergeMap(data => this.handleOutput(data.message, data.invocation)))
          .subscribe(
            null,
            error => {
              console.error(`Message processing of execution ${invocation.id} ended unexpectedly at ${Date.now()}`);
              console.error(error);
              console.log(`Stopping execution ${invocation.id} now`);
              this.codeRunner.stop(invocation.id);
              this.completeExecution(invocation.id, ExecutionStatus.Failed);
            },
            () => {
              console.log(`Message stream completed for execution ${invocation.id} at ${Date.now()}`);
            }
          );
      });

    newInvocations$
      .pipe(
        filter((invocation: Invocation) => invocation.type === InvocationType.StopExecution),
        mergeMap(invocation => this.stopValidationService.validate(invocation))
      )
      .subscribe(validationContext => {
        const execution: Execution = validationContext.resolved.get(ExecutionResolver);
        if (validationContext.isApproved() && execution) {
          this.completeExecution(execution.id, ExecutionStatus.Stopped);
          this.codeRunner.stop(execution.id);
        } else {
          console.log('Request to stop invocation was invalid');
        }
      });
  }

  /**
   * Take a run and observe the output. The run maybe cached or rejected
   * but it is guaranteed to get some message back.
   */
  getOutputAsObservable(invocation: Invocation): Observable<{ message: ExecutionMessage; invocation: Invocation }> {
    console.log(`Starting new run ${invocation.id}`);

    // check if we have existing output for the requested run
    const hash = Crypto.getCacheHash(invocation.data);
    // otherwise, try to get approval
    return this.startValidationService.validate(invocation).pipe(
      switchMap(validationContext => {
        if (validationContext.isApproved() && validationContext.resolved.get(LabConfigResolver)) {
          // if we get the approval, create the meta data
          this.createExecutionAndUpdateLabs(invocation, hash);
          // and execute the code
          const config = validationContext.resolved.get(LabConfigResolver);

          return this.codeRunner.run(invocation, config).pipe(
            map(data => this.processStreamDataToExecutionMessage(data)),
            startWith(<ExecutionMessage>{
              kind: MessageKind.ExecutionStarted,
              data: '\r\nExecution started... (this might take a little while)\r\n'
            }),
            concat(
              of(<ExecutionMessage>{
                kind: MessageKind.ExecutionFinished,
                data: ''
              })
            ),
            tap(msg => {
              if (msg.kind === MessageKind.ExecutionFinished) {
                this.completeExecution(invocation.id);
              }
            }),
            msgs => this.recycleService.watch(invocation.id, msgs)
          );
        }

        // if we don't get an approval, reject it
        return of(<ExecutionMessage>{
          kind: MessageKind.ExecutionRejected,
          data: validationContext.validationResult,
          index: 0,
          virtual_index: 0
        });
      }),
      map(msg => {
        msg.terminal_mode = true;
        return msg;
      }),
      map(message => ({ message, invocation }))
    );
  }

  handleOutput(message: ExecutionMessage, invocation: Invocation) {
    if (message.index === MAX_MESSAGES_COUNT) {
      // If coincidentally this message will be the ExecutionFinished message,
      // things will still be ok because we don't change the `kind` which means
      // it gets written just fine (despite the changed data)
      message.data = 'Maximum output capacity reached. Process keeps going but no further output is saved.';
      return this.writeExecutionMessage(message, invocation);
    } else if (message.index > MAX_MESSAGES_COUNT && message.kind === MessageKind.ExecutionFinished) {
      return this.writeExecutionMessage(message, invocation);
    } else if (message.index <= MAX_MESSAGES_COUNT) {
      return this.writeExecutionMessage(message, invocation);
    }

    return empty();
  }

  createExecutionAndUpdateLabs(invocation: Invocation, hash: string) {
    const lab = Object.assign({}, invocation.data, {
      directory: JSON.stringify(invocation.data.directory)
    });

    dbRefBuilder
      .executionRef(invocation.id)
      .set({
        id: invocation.id,
        cache_hash: hash,
        lab: lab,
        server_info: `${this.server.name} (${this.server.hardware_type})`,
        hardware_type: this.server.hardware_type,
        server_id: this.server.id,
        started_at: firebase.database.ServerValue.TIMESTAMP,
        user_id: invocation.user_id,
        status: ExecutionStatus.Executing
      })
      .pipe(
        catchError(err => {
          console.error(`Failed to update execution ${invocation.id} of lab ${invocation.data.id}`);
          return empty();
        })
      )
      .subscribe();
  }

  completeExecution(executionId: string, status = ExecutionStatus.Finished) {
    dbRefBuilder
      .executionRef(executionId)
      .onceValue()
      .pipe(
        map(snapshot => snapshot.val()),
        switchMap(execution => {
          const executing = execution && execution.status === ExecutionStatus.Executing;

          const delta = {};

          if (status === ExecutionStatus.Finished) {
            delta['finished_at'] = firebase.database.ServerValue.TIMESTAMP;
          }

          if (status === ExecutionStatus.Failed) {
            delta['failed_at'] = firebase.database.ServerValue.TIMESTAMP;
          }

          if (status === ExecutionStatus.Stopped) {
            delta['stopped_at'] = firebase.database.ServerValue.TIMESTAMP;
          }

          // We want to change the status only if it is still `executing`.
          // If not, it is finalized already and the state shouldn't change.
          if (executing) {
            delta['status'] = status;
          }

          return dbRefBuilder.executionRef(executionId).update(delta);
        }),
        catchError(err => {
          console.error(`Failed to complete execution ${executionId} to state ${status}`);
          return empty();
        })
      )
      .subscribe();
  }

  processStreamDataToExecutionMessage(data: ProcessStreamData): ExecutionMessage {
    return {
      data: data.str,
      kind: toMessageKind(data.origin),
      terminal_mode: true
    };
  }

  writeExecutionMessage(data: ExecutionMessage, run: Invocation) {
    const id = db.ref().push().key;
    data.id = id;
    data.timestamp = firebase.database.ServerValue.TIMESTAMP;
    return dbRefBuilder
      .executionMessageRef(run.id, id)
      .set(data)
      .pipe(
        catchError(err => {
          console.error(`Failed to write message for execution ${run.id} of lab ${run.data.id}`);
          return empty();
        })
      );
  }
}
