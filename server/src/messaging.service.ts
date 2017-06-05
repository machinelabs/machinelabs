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
import { ValidationContext } from './models/validation-context';
import { LabConfigResolver } from './validation/resolver/lab-config-resolver';

export class MessagingService {

  db = new DbRefBuilder();
  server: Server;

  constructor(private validationService: ValidationService,
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
    // Listen on all incoming runs to do the right thing
    this.db.newInvocationsForServerRef(this.server.id).childAdded()
        .map(snapshot => snapshot.val().common)
        .switchMap(invocation => this.getOutputAsObservable(invocation))
        .switchMap(data => this.writeExecutionMessage(data.output, data.invocation))
        .subscribe();

    // Listen on all changed runs to get notified about stops
    this.db.invocationsForServerRef(this.server.id).childChanged()
        .map(snapshot => snapshot.val().common)
        .filter(execution => execution.type === InvocationType.StopExecution)
        .subscribe(execution => this.codeRunner.stop(execution));
  }

  /**
   * Take a run and observe the output. The run maybe cached or rejected
   * but it is guaranteed to get some message back.
   */
  getOutputAsObservable(invocation: Invocation) : Observable<any> {
    console.log(`Starting new run ${invocation.id}`);

    // check if we have existing output for the requested run
    let hash = Crypto.getCacheHash(invocation.data);
    return this.getExistingExecutionAsObservable(hash)
               .switchMap(execution => {
                  // if we do have output, send a redirect message
                  if (execution) {
                    console.log('redirecting output');
                    return Observable.of(<ExecutionMessage>{
                              kind: MessageKind.OutputRedirected,
                              data: '' + execution.id
                            });
                  }


                  // otherwise, try to get approval
                  return this.validationService
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
                                              if (msg.kind === MessageKind.ExecutionFinished){
                                                this.completeExecution(invocation);
                                              }
                                            });
                                }

                                // if we don't get an approval, reject it
                                return Observable.of(<ExecutionMessage>{
                                  kind: MessageKind.ExecutionRejected,
                                  data: validationContext.validationResult
                                });
                              });

              })
              .map(output => ({output, invocation}));
  }

  createExecutionAndUpdateLabs(invocation: Invocation, hash: string) {
    this.db.executionRef(invocation.id)
      .set({
        id: invocation.id,
        cache_hash: hash,
        lab: invocation.data,
        server_info: `${this.server.name} (${this.server.hardware_type})`,
        started_at: firebase.database.ServerValue.TIMESTAMP,
        user_id: invocation.user_id,
        status: ExecutionStatus.Executing
      })
      .switchMap(_ => this.db.labsForHashRef(hash).onceValue())
      .map(snapshot => snapshot.val())
      .subscribe(labs => {

        let updates = Object.keys(labs || {})
          .map(key => labs[key])
          .reduce((prev, lab) => (prev[`/labs/${lab.id}/common/has_cached_run`] = true) && prev, {});

        let updateCount = Object.keys(updates).length;

        console.log(`Updating ${updateCount} labs with associated run`);
        // This updates all labs at once
        this.db.rootRef().update(updates);
      });
  }

  completeExecution(run: Invocation) {
    this.db.executionRef(run.id)
      .update({
        finished_at: firebase.database.ServerValue.TIMESTAMP,
        status: ExecutionStatus.Finished
      });
  }

  /**
   * Gets an Observable<Execution> that emits once with either null or an existing output 
   */
  getExistingExecutionAsObservable(executionHash: string) : Observable<Execution> {
    return this.db.executionByHashRef(executionHash)
                  .onceValue()
                  .map(snapshot => snapshot.val())
                  .map(val => val ? val[Object.keys(val)[0]].common : null);
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
