import * as firebase from 'firebase';
import { Crypto } from './util/crypto';
import { db, AuthService } from './ml-firebase';
import { CodeRunner, ProcessStreamData } from './code-runner/code-runner';
import { Observable } from '@reactivex/rxjs';
import { Run, RunAction } from './models/run';
import { OutputMessage, OutputKind, toOutputKind } from './models/output';

export class MessagingService {

  constructor(private authService: AuthService, private codeRunner: CodeRunner) {
  }

  init() {

    this.getNewRunsAsObservable()
        .switchMap(run => {
          console.log(`Starting new run ${run.id}`);

          // check if we have existing output for the requested run
          let hash = Crypto.hashLabFiles(run.lab);
          return this.getExistingOutputAsObservable(hash)
                    .switchMap(output => {

                      // if we do have output, send a redirect message
                      if (output) {
                        console.log('redirecting output');
                        return Observable.of({
                                  origin: 'output_redirected',
                                  raw: '',
                                  str: '' + output.id
                                });
                      }

                      // ...if we don't, create runs_meta and execute code
                      db.ref(`runs_meta/${run.id}`).set({
                        id: run.id,
                        file_set_hash: hash
                      });

                      return this.codeRunner.run(run)
                                .concat(Observable.of({
                                  origin: 'process_finished',
                                  raw: '',
                                  str: ''
                                }))
                    })
                    .map(output => ({output, run}));
        })
        .switchMap(data => this.writeOutput(data.output, data.run))
        .subscribe();

    this.getChangedRunsAsObservable()
        .filter(run => run.type === RunAction.Stop)
        .subscribe(run => this.codeRunner.stop(run));
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


  writeOutput(data: ProcessStreamData, run: Run) {
    let id = db.ref().push().key;
    let output = {
      id: id,
      data: data.str,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      kind: toOutputKind(data.origin)
    };
    return Observable.fromPromise(<Promise<any>>db.ref(`process_messages/${run.id}/${id}`).set(output));
  }
}