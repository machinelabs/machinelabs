import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Lab, ExecutionStatus, LabExecutionContext } from './models/lab';
import { Run, RunAction } from './models/run';
import * as shortid from 'shortid';
import * as firebase from 'firebase';

import { DATABASE } from './app.tokens';
import { AuthService } from './auth';

@Injectable()
export class RemoteLabExecService {

  constructor(@Inject(DATABASE) private db, private authService: AuthService) {
  }

  _childAddedAsObservable(ref: any) {
    return Observable.fromEventPattern(handler => ref.on('child_added', handler),
                                       handler => ref.off('child_added', handler));
  }

  /**
   * Executes code on the server. Returns an Observable<string>
   * where `string` is each line that was printed to STDOUT.
   */
  run (context: LabExecutionContext, lab: Lab) : Observable<string> {

    // This shouldn't really happen in practice because the UI forbids this.
    // But semantically it makes sense to check for it.
    if (context.status === ExecutionStatus.Running) {
      this.stop(context.clone());
    }

    let id = `${Date.now()}-${shortid.generate()}`;
    context.setData(lab, id);
    context.status = ExecutionStatus.Running;
    
    return this.authService
              .requireAuthOnce()
              .switchMap(login => {
                let res = this.db.ref(`runs/${context.id}`).set({
                  id: context.id,
                  user_id: login.uid,
                  timestamp: firebase.database.ServerValue.TIMESTAMP,
                  type: RunAction.Run,
                  lab: {
                    id: context.lab.id,
                    files: context.lab.files
                  }
                });

                return Observable.fromPromise(res);
              })
              .switchMap(_ => this._childAddedAsObservable(this.db.ref(`outputs/${context.id}/messages`)))
              .map((msg:any) => msg.val())
              .takeWhile((msg:any) => msg.kind !== 'process_finished')
              .map((msg:any) => msg.data)
              .finally(() => context.status = ExecutionStatus.Done);
  }

  stop(context: LabExecutionContext) {
    context.status = ExecutionStatus.Stopped;
    return this.authService
      .requireAuthOnce()
      .switchMap(_ => Observable.fromPromise(this.db.ref(`runs/${context.id}`).once('value')))
      .map((snapshot: any) => snapshot.val())
      .switchMap(data => Observable.fromPromise(this.db.ref(`runs/${context.id}`)
                                   .set(Object.assign(data, { type: RunAction.Stop }))))
      .subscribe();
  }
}
