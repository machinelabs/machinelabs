import * as firebase from 'firebase';
import { Crypto } from './util/crypto';
import { db, AuthService, DbRefBuilder } from './ml-firebase';
import { CodeRunner, ProcessStreamData } from './code-runner/code-runner';
import { Observable } from '@reactivex/rxjs';
import { Run, RunAction } from './models/run';
import { OutputMessage, OutputKind, toOutputKind } from './models/output';
import { RulesService } from 'rules.service';


export class MessagingService {

  db = new DbRefBuilder();

  constructor(private authService: AuthService,
              private rulesService: RulesService,
              private codeRunner: CodeRunner) {
  }

  init() {
    this.getNewRunsAsObservable()
        .switchMap(run => this.getOutputAsObservable(run))
        .switchMap(data => this.writeOutputMessage(data.output, data.run))
        .subscribe();

    this.getChangedRunsAsObservable()
        .filter(run => run.type === RunAction.Stop)
        .subscribe(run => this.codeRunner.stop(run));
  }

  /**
   * Take a run and observe the output. The run maybe cached or rejected
   * but it is guaranteed to get some message back.
   */
  getOutputAsObservable(run: Run) : Observable<any> {
    console.log(`Starting new run ${run.id}`);

    // check if we have existing output for the requested run
    let hash = Crypto.hashLabFiles(run.lab);
    return this.getExistingOutputAsObservable(hash)
               .switchMap(output => {
                  // if we do have output, send a redirect message
                  if (output) {
                    console.log('redirecting output');
                    return Observable.of({
                              kind: OutputKind.OutputRedirected,
                              data: '' + output.id
                            });
                  }

                  // otherwise, try to get approval
                  return this.rulesService
                              .getApproval(run)
                              .switchMap(approval => {
                                if (approval.canRun) {
                                  // if we get the approval, create the meta data
                                  this.createRunMetaAndUpdateLabs(run, hash);
                                  // and execute the code
                                  return this.codeRunner
                                            .run(run)
                                            .map(data => this.processStreamDataToOutputMessage(data))
                                            .concat(Observable.of({
                                              kind: OutputKind.ProcessFinished,
                                              data: ''
                                            }));
                                }

                                // if we don't get an approval, reject it
                                return Observable.of({
                                  kind: OutputKind.ExecutionRejected,
                                  data: approval.message
                                });
                              });

              })
              .map(output => ({output, run}));
  }

  createRunMetaAndUpdateLabs(run: Run, hash: string) {
    this.db.runMetaRef(run.id)
      .set({
        id: run.id,
        file_set_hash: hash
      })
      .switchMap(_ => this.db.labsForHashRef(hash).onceValue())
      .map(snapshot => snapshot.val())
      .subscribe(labs => {

        let updates = Object.keys(labs || {})
          .map(key => labs[key])
          .reduce((prev, lab) => (prev[`/labs/${lab.id}/has_cached_run`] = true) && prev, {});

        let updateCount = Object.keys(updates).length;

        console.log(`Updating ${updateCount} labs with associated run`);
        // This updates all labs at once
        this.db.rootRef().update(updates);
      });

  }

  /**
   * Gets an Observable<Output> that emits once with either null or an existing output 
   */
  getExistingOutputAsObservable(fileSetHash: string) : Observable<any> {
    return Observable.fromPromise(<Promise<any>>db.ref('runs_meta')
                                   .orderByChild('file_set_hash')
                                   .equalTo(fileSetHash)
                                   .once('value'))
                                   .map(snapshot => snapshot.val())
                                   .map(val => val ? val[Object.keys(val)[0]] : null);
  }


  /**
   * Gets an Observable<Run> that emits every time a new run was added 
   */
  getNewRunsAsObservable() : Observable<Run> {
    return this.getEventAsObservable('child_added', db.ref('runs').orderByChild('timestamp').startAt(Date.now()));
  }

  /**
   * Gets an Observable<Run> that emits every time a run was changed (e.g stopped)
   */
  getChangedRunsAsObservable() : Observable<Run> {
    return this.getEventAsObservable('child_changed', db.ref('runs'));
  }

  /**
   * Gets an Observable<any> based on an event name from any given ref
   */
  getEventAsObservable(event: string, ref: any) : Observable<any> {
    return this.authService
               .authenticate()
               .switchMap(_ => {
                  return Observable.fromEventPattern(handler => ref.on(event, handler),
                                                     handler => ref.off(event, handler));
               })
               .map((data:any) => data.val());
  }

  processStreamDataToOutputMessage(data: ProcessStreamData): OutputMessage {
    return {
      data: data.str,
      kind: toOutputKind(data.origin)
    }
  }

  writeOutputMessage(data: OutputMessage, run: Run) {
    let id = db.ref().push().key;
    data.id = id;
    data.timestamp = firebase.database.ServerValue.TIMESTAMP;
    return this.db.processMessageRef(run.id, id).set(data);
  }
}