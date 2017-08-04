import * as firebase from 'firebase';
import { Crypto } from './util/crypto';
import { environment } from './environments/environment';
import { db, DbRefBuilder } from './ml-firebase';
import { CodeRunner, ProcessStreamData } from './code-runner/code-runner';
import { Observable } from '@reactivex/rxjs';
import { Invocation, InvocationType } from './models/invocation';
import { Execution, ExecutionStatus, ExecutionMessage, MessageKind, toMessageKind } from './models/execution';
import { ValidationService } from './validation/validation.service';
import { Server } from './models/server';
import { ValidationContext } from './validation/validation-context';
import { LabConfigResolver } from './validation/resolver/lab-config-resolver';
import { ExecutionResolver } from './validation/resolver/execution-resolver';

export class MessagingService {

  db = new DbRefBuilder();
  server: Server;

  constructor(private startValidationService: ValidationService,
              private stopValidationService: ValidationService,
              private codeRunner: CodeRunner) {
  }

  init() {

    this.db.serverRef(environment.serverId).onceValue()
        .map(snapshot => snapshot.val())
        .subscribe(server => {
          this.server = server;
          this.initMessaging();
        });
  }

  initMessaging () {

    // Share one subscription to all incoming messages
    let newInvocations$ = this.db.newInvocationsForServerRef(this.server.id)
                                 .childAdded()
                                 .map(snapshot => snapshot.val().common)
                                 .share();

    // Invoke new processes for incoming StartExecution Invocations
    newInvocations$
      .filter((invocation: Invocation) => invocation.type === InvocationType.StartExecution)
      .flatMap(invocation => this.getOutputAsObservable(invocation))
      .flatMap(data => this.writeExecutionMessage(data.message, data.invocation))
      .subscribe();

    newInvocations$
      .filter((invocation: Invocation) => invocation.type === InvocationType.StopExecution)
      .flatMap(invocation => this.stopValidationService.validate(invocation))
      .subscribe(validationContext => {
          let execution = validationContext.resolved.get(ExecutionResolver);
          if (validationContext.isApproved() && execution){
            this.codeRunner.stop(execution.id)
          } else {
            console.log('Request to stop invocation was invalid');
          }
        });
  }

  /**
   * Take a run and observe the output. The run maybe cached or rejected
   * but it is guaranteed to get some message back.
   */
  getOutputAsObservable(invocation: Invocation): Observable<any> {
    console.log(`Starting new run ${invocation.id}`);

    // check if we have existing output for the requested run
    let hash = Crypto.getCacheHash(invocation.data);
    // otherwise, try to get approval
    return this.startValidationService
      .validate(invocation)
      .switchMap(validationContext => {
        if (validationContext.isApproved() && validationContext.resolved.get(LabConfigResolver)) {
          // if we get the approval, create the meta data
          this.createExecutionAndUpdateLabs(invocation, hash);
          // and execute the code
          let config = validationContext.resolved.get(LabConfigResolver);

          return this.codeRunner
            .run(invocation, config)
            .map(data => this.processStreamDataToExecutionMessage(data))
            .startWith(<ExecutionMessage>{
              kind: MessageKind.ExecutionStarted,
              data: 'Execution started... (this might take a little while)'
            })
            .concat(Observable.of(<ExecutionMessage>{
              kind: MessageKind.ExecutionFinished,
              data: ''
            }))
            .do(msg => {
              if (msg.kind === MessageKind.ExecutionFinished) {
                this.completeExecution(invocation);
              }
            });
        }

        // if we don't get an approval, reject it
        return Observable.of(<ExecutionMessage>{
          kind: MessageKind.ExecutionRejected,
          data: validationContext.validationResult
        });
      })
      .map((message, index) => Object.assign(message, { index }))
      .map(message => ({ message, invocation }));
  }

  createExecutionAndUpdateLabs(invocation: Invocation, hash: string) {
    this.db.executionRef(invocation.id)
      .set({
        id: invocation.id,
        cache_hash: hash,
        lab: invocation.data,
        server_info: `${this.server.name} (${this.server.hardware_type})`,
        hardware_type: this.server.hardware_type,
        server_id: this.server.id,
        started_at: firebase.database.ServerValue.TIMESTAMP,
        user_id: invocation.user_id,
        status: ExecutionStatus.Executing
      })
      .subscribe();
  }

  completeExecution(run: Invocation) {
    this.db.executionRef(run.id)
      .update({
        finished_at: firebase.database.ServerValue.TIMESTAMP,
        status: ExecutionStatus.Finished
      });
  }

  processStreamDataToExecutionMessage(data: ProcessStreamData): ExecutionMessage {
    return {
      data: data.str,
      kind: toMessageKind(data.origin)
    };
  }

  writeExecutionMessage(data: ExecutionMessage, run: Invocation) {
    let id = db.ref().push().key;
    data.id = id;
    data.timestamp = firebase.database.ServerValue.TIMESTAMP;
    return this.db.executionMessageRef(run.id, id).set(data);
  }
}
