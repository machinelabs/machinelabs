import * as firebase from 'firebase';
import { db, AuthService } from './fb';
import { CodeRunner, ProcessStreamData } from './code-runner/code-runner';
import { Observable } from '@reactivex/rxjs';
import { Run } from 'models/run';

export class MessagingService {

  constructor(private authService: AuthService, private codeRunner: CodeRunner) {
  }

  init() {

    this.getNewRunsAsObservable()
        .switchMap(run => {
          console.log(`Starting new run ${run.id}`);
          return this.codeRunner.run(run)
                                .concat(Observable.of({
                                  origin: 'process_finished',
                                  raw: '',
                                  str: ''
                                }))
                                .map(output => ({output, run}))
        })
        .switchMap(data => this.writeOutput(data.output, data.run))
        .subscribe();

    this.getChangedRunsAsObservable()
        .filter(run => run.type === 'stopped')
        .subscribe(run => this.codeRunner.stop(run));
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
      kind: data.origin
    };
    return Observable.fromPromise(<Promise<any>>db.ref(`outputs/${run.id}/messages/${id}`).set(output));
  }
}